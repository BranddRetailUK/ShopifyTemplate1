import pg from 'pg';

const { Pool } = pg;

export function createDatabase(connectionString) {
  if (!connectionString) throw new Error('DATABASE_URL is required.');
  return new Pool({ connectionString, max: 5, idleTimeoutMillis: 30_000 });
}

export async function initializeDatabase(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS license_activations (
      id BIGSERIAL PRIMARY KEY,
      marketplace TEXT NOT NULL,
      purchase_fingerprint CHAR(64) NOT NULL UNIQUE,
      item_id TEXT NOT NULL,
      shop_domain TEXT NOT NULL,
      theme_version TEXT NOT NULL,
      license_name TEXT NOT NULL DEFAULT '',
      sold_at TIMESTAMPTZ,
      supported_until TIMESTAMPTZ,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
      activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS license_activations_shop_domain_idx
      ON license_activations (shop_domain);

    CREATE TABLE IF NOT EXISTS license_rate_limits (
      scope_fingerprint CHAR(64) NOT NULL,
      window_started_at TIMESTAMPTZ NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (scope_fingerprint, window_started_at)
    );
  `);
}

export async function pingDatabase(pool) {
  await pool.query('SELECT 1');
}

export async function consumeRateLimit(pool, { scopeFingerprint, windowStartedAt, limit }) {
  const result = await pool.query(
    `
      INSERT INTO license_rate_limits (scope_fingerprint, window_started_at, attempts)
      VALUES ($1, $2, 1)
      ON CONFLICT (scope_fingerprint, window_started_at)
      DO UPDATE SET attempts = license_rate_limits.attempts + 1
      RETURNING attempts
    `,
    [scopeFingerprint, windowStartedAt],
  );

  if (Math.random() < 0.02) {
    await pool.query("DELETE FROM license_rate_limits WHERE window_started_at < NOW() - INTERVAL '2 days'");
  }

  return result.rows[0].attempts <= limit;
}

export async function activateLicense(pool, activation) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [activation.purchaseFingerprint]);
    const existing = await client.query(
      `SELECT shop_domain, status FROM license_activations WHERE purchase_fingerprint = $1 FOR UPDATE`,
      [activation.purchaseFingerprint],
    );

    if (existing.rowCount) {
      const current = existing.rows[0];
      if (current.status === 'active' && current.shop_domain !== activation.shopDomain) {
        await client.query('ROLLBACK');
        return { state: 'domain_conflict' };
      }

      await client.query(
        `
          UPDATE license_activations
          SET item_id = $2,
              shop_domain = $3,
              theme_version = $4,
              license_name = $5,
              sold_at = $6,
              supported_until = $7,
              status = 'active',
              last_verified_at = NOW(),
              updated_at = NOW()
          WHERE purchase_fingerprint = $1
        `,
        [
          activation.purchaseFingerprint,
          activation.itemId,
          activation.shopDomain,
          activation.themeVersion,
          activation.licenseName,
          activation.soldAt,
          activation.supportedUntil,
        ],
      );
      await client.query('COMMIT');
      return { state: 'already_active' };
    }

    await client.query(
      `
        INSERT INTO license_activations (
          marketplace,
          purchase_fingerprint,
          item_id,
          shop_domain,
          theme_version,
          license_name,
          sold_at,
          supported_until
        ) VALUES ('envato', $1, $2, $3, $4, $5, $6, $7)
      `,
      [
        activation.purchaseFingerprint,
        activation.itemId,
        activation.shopDomain,
        activation.themeVersion,
        activation.licenseName,
        activation.soldAt,
        activation.supportedUntil,
      ],
    );
    await client.query('COMMIT');
    return { state: 'activated' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
