import process from 'node:process';

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function loadConfig(environment = process.env) {
  const hashSecret = environment.LICENSE_HASH_SECRET || '';
  if (hashSecret && hashSecret.length < 32) {
    throw new Error('LICENSE_HASH_SECRET must contain at least 32 characters.');
  }

  return {
    port: positiveInteger(environment.PORT, 3000),
    databaseUrl: environment.DATABASE_URL || '',
    envatoToken: environment.ENVATO_TOKEN || '',
    envatoItemId: String(environment.ENVATO_ITEM_ID || ''),
    hashSecret,
    allowedThemeVersions: new Set(
      String(environment.ALLOWED_THEME_VERSIONS || '1.0.0')
        .split(',')
        .map((version) => version.trim())
        .filter(Boolean),
    ),
    requestBodyLimit: positiveInteger(environment.REQUEST_BODY_LIMIT_BYTES, 16_384),
    rateLimit: positiveInteger(environment.ACTIVATION_RATE_LIMIT, 10),
    rateLimitWindowMs: positiveInteger(environment.ACTIVATION_RATE_WINDOW_MS, 15 * 60 * 1000),
  };
}

export function activationConfigurationReady(config) {
  return Boolean(
    config.databaseUrl
      && config.hashSecret
      && config.envatoToken
      && config.envatoItemId,
  );
}
