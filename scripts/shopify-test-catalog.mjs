import fs from 'node:fs';
import process from 'node:process';

const API_VERSION = '2026-07';
const TEST_CATALOG_TAG = 'theme-test-catalog';
const TEST_COLLECTION_HANDLE = 'theme-test-catalog';
const TEST_VENDOR = 'Theme Test Catalog';
const DEFAULT_TAGS = [TEST_CATALOG_TAG, 'theme-assets'];
const TEST_PRODUCTS = [
  {
    title: 'Theme Test Beanie',
    handle: 'theme-test-beanie',
    descriptionHtml: `
      <p>A two-variant accessory for testing option selectors, sale pricing, product cards, and variant imagery.</p>
      <ul>
        <li>Navy is shown with a compare-at price.</li>
        <li>Dark sage uses a second product image.</li>
      </ul>
    `,
    productType: 'Accessories',
    productOptions: [
      {
        name: 'Color',
        position: 1,
        values: [{ name: 'Navy' }, { name: 'Dark sage' }],
      },
    ],
    files: [
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/childrens-black-beanie.jpg?v=1644535019',
        filename: 'theme-test-beanie-navy.jpg',
        alt: 'Navy children’s beanie',
        contentType: 'IMAGE',
      },
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/kids-beanie.jpg?v=1644535019',
        filename: 'theme-test-beanie-dark-sage.jpg',
        alt: 'Dark sage children’s beanie',
        contentType: 'IMAGE',
      },
    ],
    variants: [
      {
        optionValues: [{ optionName: 'Color', name: 'Navy' }],
        price: '24.00',
        compareAtPrice: '30.00',
        sku: 'THEME-TEST-BEANIE-NAVY',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Color', name: 'Dark sage' }],
        price: '26.00',
        sku: 'THEME-TEST-BEANIE-SAGE',
        taxable: true,
      },
    ],
  },
  {
    title: 'Theme Test Enamel Pins',
    handle: 'theme-test-enamel-pins',
    descriptionHtml:
      '<p>A one-option product with several values for testing variant pills, price changes, and compact product galleries.</p>',
    productType: 'Accessories',
    productOptions: [
      {
        name: 'Shape',
        position: 1,
        values: [
          { name: 'Hotdog' },
          { name: 'Lightning bolt' },
          { name: 'Pineapple' },
          { name: 'Pizza' },
        ],
      },
    ],
    files: [
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/hipster-enamel-pin-hotdog.jpg?v=1644535038',
        filename: 'theme-test-enamel-pin-hotdog.jpg',
        alt: 'Hotdog enamel pin',
        contentType: 'IMAGE',
      },
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/lightning-hard-enamel-lapel-pin.jpg?v=1644535038',
        filename: 'theme-test-enamel-pin-lightning.jpg',
        alt: 'Lightning bolt enamel pin',
        contentType: 'IMAGE',
      },
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/pineapple-soft-enamel-lapel-pin.jpg?v=1644535038',
        filename: 'theme-test-enamel-pin-pineapple.jpg',
        alt: 'Pineapple enamel pin',
        contentType: 'IMAGE',
      },
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/pizza-hard-enamel-lapel-pin.jpg?v=1644535038',
        filename: 'theme-test-enamel-pin-pizza.jpg',
        alt: 'Pizza enamel pin',
        contentType: 'IMAGE',
      },
    ],
    variants: [
      {
        optionValues: [{ optionName: 'Shape', name: 'Hotdog' }],
        price: '8.00',
        compareAtPrice: '10.00',
        sku: 'THEME-TEST-PIN-HOTDOG',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Shape', name: 'Lightning bolt' }],
        price: '8.00',
        sku: 'THEME-TEST-PIN-LIGHTNING',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Shape', name: 'Pineapple' }],
        price: '9.00',
        sku: 'THEME-TEST-PIN-PINEAPPLE',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Shape', name: 'Pizza' }],
        price: '9.00',
        sku: 'THEME-TEST-PIN-PIZZA',
        taxable: true,
      },
    ],
  },
  {
    title: 'Theme Test Pants — Rich Text',
    handle: 'theme-test-pants-rich-text',
    descriptionHtml: `
      <p>This product exercises the complete rich-text treatment used by product descriptions and editorial content.</p>
      <h2>Designed for everyday movement</h2>
      <p>Cut from a soft mid-weight fabric with a relaxed leg and an adjustable waist.</p>
      <blockquote>Comfort should look considered.</blockquote>
      <h3>Details</h3>
      <ul>
        <li>Relaxed unisex fit</li>
        <li>Elasticated waist</li>
        <li>Side-seam pockets</li>
      </ul>
      <h3>Care</h3>
      <ol>
        <li>Wash cold</li>
        <li>Reshape while damp</li>
        <li>Air dry</li>
      </ol>
    `,
    productType: 'Apparel',
    productOptions: [
      {
        name: 'Size',
        position: 1,
        values: [{ name: 'S' }, { name: 'M' }, { name: 'L' }],
      },
    ],
    files: [
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/child-grey-sweatpants.jpg?v=1644535042',
        filename: 'theme-test-pants.jpg',
        alt: 'Grey children’s sweatpants',
        contentType: 'IMAGE',
      },
    ],
    variants: [
      {
        optionValues: [{ optionName: 'Size', name: 'S' }],
        price: '48.00',
        sku: 'THEME-TEST-PANTS-S',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Size', name: 'M' }],
        price: '48.00',
        sku: 'THEME-TEST-PANTS-M',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Size', name: 'L' }],
        price: '48.00',
        sku: 'THEME-TEST-PANTS-L',
        taxable: true,
      },
    ],
  },
  {
    title: 'Theme Test Landscape Poster',
    handle: 'theme-test-landscape-poster',
    descriptionHtml:
      '<p>A wide-format image for testing product-card crops, responsive galleries, and image focal behaviour.</p>',
    productType: 'Art',
    productOptions: [
      {
        name: 'Size',
        position: 1,
        values: [{ name: 'A4' }, { name: 'A3' }],
      },
    ],
    files: [
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/landscape_16to9.jpg?v=1644535046',
        filename: 'theme-test-landscape-poster.jpg',
        alt: 'Wide landscape test poster',
        contentType: 'IMAGE',
      },
    ],
    variants: [
      {
        optionValues: [{ optionName: 'Size', name: 'A4' }],
        price: '18.00',
        sku: 'THEME-TEST-POSTER-A4',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Size', name: 'A3' }],
        price: '28.00',
        sku: 'THEME-TEST-POSTER-A3',
        taxable: true,
      },
    ],
  },
  {
    title: 'Theme Test Transparent Shapes',
    handle: 'theme-test-transparent-shapes',
    descriptionHtml:
      '<p>A transparent PNG asset for checking media backgrounds, borders, shadows, and image containment.</p>',
    productType: 'Art',
    productOptions: [
      {
        name: 'Format',
        position: 1,
        values: [{ name: 'Digital' }, { name: 'Print' }],
      },
    ],
    files: [
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/Untitled_drawing_15_7afe6d53-20be-4c9c-a2e1-6f9379ae7f81.png?v=1644535057',
        filename: 'theme-test-transparent-shapes.png',
        alt: 'Transparent geometric shapes',
        contentType: 'IMAGE',
      },
    ],
    variants: [
      {
        optionValues: [{ optionName: 'Format', name: 'Digital' }],
        price: '12.00',
        sku: 'THEME-TEST-SHAPES-DIGITAL',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Format', name: 'Print' }],
        price: '22.00',
        sku: 'THEME-TEST-SHAPES-PRINT',
        taxable: true,
      },
    ],
  },
  {
    title: 'Theme Test Socks',
    handle: 'theme-test-socks',
    descriptionHtml:
      '<p>A two-option product for testing option combinations, unavailable combinations, and mobile add-to-cart controls.</p>',
    productType: 'Apparel',
    productOptions: [
      {
        name: 'Color',
        position: 1,
        values: [{ name: 'Geometric' }, { name: 'Hotdog' }],
      },
      {
        name: 'Size',
        position: 2,
        values: [{ name: 'S/M' }, { name: 'L/XL' }],
      },
    ],
    files: [
      {
        originalSource:
          'https://cdn.shopify.com/s/files/1/0593/4111/1352/products/color-geometric-socks.jpg?v=1644535067',
        filename: 'theme-test-socks-geometric.jpg',
        alt: 'Geometric pattern socks',
        contentType: 'IMAGE',
      },
    ],
    variants: [
      {
        optionValues: [
          { optionName: 'Color', name: 'Geometric' },
          { optionName: 'Size', name: 'S/M' },
        ],
        price: '14.00',
        sku: 'THEME-TEST-SOCKS-GEO-SM',
        taxable: true,
      },
      {
        optionValues: [
          { optionName: 'Color', name: 'Geometric' },
          { optionName: 'Size', name: 'L/XL' },
        ],
        price: '14.00',
        sku: 'THEME-TEST-SOCKS-GEO-LXL',
        taxable: true,
      },
      {
        optionValues: [
          { optionName: 'Color', name: 'Hotdog' },
          { optionName: 'Size', name: 'S/M' },
        ],
        price: '16.00',
        compareAtPrice: '20.00',
        sku: 'THEME-TEST-SOCKS-HOTDOG-SM',
        taxable: true,
      },
    ],
  },
  {
    title: 'Theme Test Product Without Media',
    handle: 'theme-test-no-media',
    descriptionHtml:
      '<p>This product intentionally has no media so placeholder states can be tested in cards, search results, cart lines, and recommendations.</p>',
    productType: 'Apparel',
    productOptions: [
      {
        name: 'Size',
        position: 1,
        values: [{ name: 'S' }, { name: 'M' }, { name: 'L' }],
      },
    ],
    variants: [
      {
        optionValues: [{ optionName: 'Size', name: 'S' }],
        price: '32.00',
        sku: 'THEME-TEST-NO-MEDIA-S',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Size', name: 'M' }],
        price: '32.00',
        sku: 'THEME-TEST-NO-MEDIA-M',
        taxable: true,
      },
      {
        optionValues: [{ optionName: 'Size', name: 'L' }],
        price: '32.00',
        sku: 'THEME-TEST-NO-MEDIA-L',
        taxable: true,
      },
    ],
  },
].map((product) => ({
  ...product,
  descriptionHtml: product.descriptionHtml.trim(),
  status: 'ACTIVE',
  tags: DEFAULT_TAGS,
  vendor: TEST_VENDOR,
}));

function readEnvFile(path) {
  const values = {};
  const source = fs.readFileSync(path, 'utf8');

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) continue;

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match) continue;

    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[match[1]] = value;
  }

  return values;
}

function normalizeShopDomain(value) {
  if (!value) return '';

  const withProtocol = value.match(/^https?:\/\//) ? value : `https://${value}`;
  const hostname = new URL(withProtocol).hostname.toLowerCase();

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(hostname)) {
    throw new Error('SHOPIFY_DOMAIN must be a valid *.myshopify.com domain.');
  }

  return hostname;
}

async function getAdminAccess(env) {
  const shop = normalizeShopDomain(env.SHOPIFY_DOMAIN);
  const clientId = env.SHOPIFY_API_KEY;
  const clientSecret = env.SHOPIFY_API_SECRET;

  if (!shop || !clientId || !clientSecret) {
    throw new Error(
      'SHOPIFY_DOMAIN, SHOPIFY_API_KEY, and SHOPIFY_API_SECRET must be set in .env.',
    );
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    redirect: 'manual',
  });
  const contentType = response.headers.get('content-type') || '';
  const location = response.headers.get('location');

  if (response.status >= 300 && response.status < 400) {
    const safeLocation = location ? new URL(location, `https://${shop}`) : null;
    const destination = safeLocation
      ? `${safeLocation.origin}${safeLocation.pathname}`
      : 'an unspecified Shopify URL';

    throw new Error(
      `Shopify token exchange redirected with HTTP ${response.status} to ${destination}.`,
    );
  }

  if (!contentType.includes('application/json')) {
    const responseText = await response.text();
    const diagnostic = responseText
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replaceAll(clientId, '[redacted client ID]')
      .replaceAll(clientSecret, '[redacted client secret]')
      .slice(0, 240);

    throw new Error(
      `Shopify token exchange returned HTTP ${response.status} with content type ${
        contentType || 'unknown'
      } instead of JSON.${diagnostic ? ` Shopify response: ${diagnostic}` : ''}`,
    );
  }

  const result = await response.json();

  if (!response.ok || !result.access_token) {
    const reason = result.error_description || result.error || `HTTP ${response.status}`;
    throw new Error(`Shopify token exchange failed: ${reason}`);
  }

  return {
    shop,
    accessToken: result.access_token,
    scopes: String(result.scope || '')
      .split(',')
      .map((scope) => scope.trim())
      .filter(Boolean),
    expiresIn: result.expires_in,
  };
}

async function adminGraphql(admin, query, variables = {}) {
  const response = await fetch(
    `https://${admin.shop}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': admin.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Shopify Admin API request failed with HTTP ${response.status}.`);
  }

  if (result.errors?.length) {
    throw new Error(
      `Shopify Admin API returned: ${result.errors
        .map((error) => error.message)
        .join('; ')}`,
    );
  }

  return result.data;
}

async function checkConnection(admin) {
  const data = await adminGraphql(
    admin,
    `#graphql
      query ThemeTestCatalogConnection {
        shop {
          name
          myshopifyDomain
          plan {
            displayName
            partnerDevelopment
          }
        }
        currentAppInstallation {
          accessScopes {
            handle
          }
        }
      }
    `,
  );
  const grantedScopes =
    data.currentAppInstallation?.accessScopes.map(({ handle }) => handle) || admin.scopes;

  return {
    shop: data.shop.name,
    domain: data.shop.myshopifyDomain,
    plan: data.shop.plan.displayName,
    partnerDevelopment: data.shop.plan.partnerDevelopment,
    tokenExpiresInSeconds: admin.expiresIn,
    grantedScopes,
    canReadProducts:
      grantedScopes.includes('read_products') || grantedScopes.includes('write_products'),
    canWriteProducts: grantedScopes.includes('write_products'),
    canReadPublications:
      grantedScopes.includes('read_publications') ||
      grantedScopes.includes('write_publications'),
    canWritePublications: grantedScopes.includes('write_publications'),
    mode: 'read-only connection check',
  };
}

async function getProductByHandle(admin, handle) {
  const data = await adminGraphql(
    admin,
    `#graphql
      query ThemeTestCatalogProduct($identifier: ProductIdentifierInput!) {
        productByIdentifier(identifier: $identifier) {
          id
          title
          handle
          status
          publishedAt
          media(first: 20) {
            nodes {
              alt
              mediaContentType
              status
            }
          }
          variants(first: 100) {
            nodes {
              id
              title
              sku
              price
              compareAtPrice
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    `,
    {
      identifier: { handle },
    },
  );

  return data.productByIdentifier;
}

async function createTestProduct(admin, product) {
  const data = await adminGraphql(
    admin,
    `#graphql
      mutation CreateThemeTestProduct(
        $input: ProductSetInput!
        $identifier: ProductSetIdentifiers
      ) {
        productSet(input: $input, identifier: $identifier, synchronous: true) {
          product {
            id
            title
            handle
            status
            publishedAt
            media(first: 20) {
              nodes {
                alt
                mediaContentType
                status
              }
            }
            variants(first: 100) {
              nodes {
                id
                title
                sku
                price
                compareAtPrice
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          userErrors {
            code
            field
            message
          }
        }
      }
    `,
    {
      input: product,
      identifier: { handle: product.handle },
    },
  );
  const errors = data.productSet.userErrors;

  if (errors.length) {
    throw new Error(
      `Could not create ${product.handle}: ${errors
        .map((error) => {
          const field = error.field?.length ? ` (${error.field.join('.')})` : '';
          return `${error.message}${field}`;
        })
        .join('; ')}`,
    );
  }

  return data.productSet.product;
}

function summarizeProduct(product, outcome) {
  return {
    outcome,
    id: product.id,
    title: product.title,
    handle: product.handle,
    status: product.status,
    publishedAt: product.publishedAt,
    media: product.media.nodes.length,
    mediaStatuses: [...new Set(product.media.nodes.map(({ status }) => status))],
    variants: product.variants.nodes.length,
  };
}

async function seedTestCatalog(admin, { dryRun = false } = {}) {
  const results = [];

  for (const productInput of TEST_PRODUCTS) {
    const existing = await getProductByHandle(admin, productInput.handle);

    if (existing) {
      results.push(summarizeProduct(existing, 'skipped-existing'));
      continue;
    }

    if (dryRun) {
      results.push({
        outcome: 'would-create',
        title: productInput.title,
        handle: productInput.handle,
        status: productInput.status,
        media: productInput.files?.length || 0,
        variants: productInput.variants.length,
      });
      continue;
    }

    const created = await createTestProduct(admin, productInput);
    results.push(summarizeProduct(created, 'created'));
  }

  return results;
}

async function getTestCollection(admin) {
  const data = await adminGraphql(
    admin,
    `#graphql
      query ThemeTestCollection($query: String!) {
        collections(first: 1, query: $query) {
          nodes {
            id
            title
            handle
            products(first: 100) {
              nodes {
                id
                handle
              }
            }
          }
        }
      }
    `,
    {
      query: `handle:${TEST_COLLECTION_HANDLE}`,
    },
  );
  const collection = data.collections.nodes.find(
    ({ handle }) => handle === TEST_COLLECTION_HANDLE,
  );

  return collection || null;
}

async function createTestCollection(admin, productIds) {
  const data = await adminGraphql(
    admin,
    `#graphql
      mutation CreateThemeTestCollection($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection {
            id
            title
            handle
            products(first: 100) {
              nodes {
                id
                handle
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      input: {
        title: 'Theme Test Catalog',
        handle: TEST_COLLECTION_HANDLE,
        descriptionHtml:
          '<p>Purpose-built product fixtures for testing this Shopify theme. These products are not part of the live Good Game Apparel catalog.</p>',
        products: productIds,
        sortOrder: 'MANUAL',
      },
    },
  );
  const errors = data.collectionCreate.userErrors;

  if (errors.length) {
    throw new Error(
      `Could not create ${TEST_COLLECTION_HANDLE}: ${errors
        .map(({ message }) => message)
        .join('; ')}`,
    );
  }

  return data.collectionCreate.collection;
}

async function addMissingCollectionProducts(admin, collection, productIds) {
  const existingIds = new Set(collection.products.nodes.map(({ id }) => id));
  const missingIds = productIds.filter((id) => !existingIds.has(id));

  if (missingIds.length === 0) return collection;

  const data = await adminGraphql(
    admin,
    `#graphql
      mutation AddThemeTestCollectionProducts($id: ID!, $productIds: [ID!]!) {
        collectionAddProducts(id: $id, productIds: $productIds) {
          collection {
            id
            title
            handle
            products(first: 100) {
              nodes {
                id
                handle
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      id: collection.id,
      productIds: missingIds,
    },
  );
  const errors = data.collectionAddProducts.userErrors;

  if (errors.length) {
    throw new Error(
      `Could not update ${TEST_COLLECTION_HANDLE}: ${errors
        .map(({ message }) => message)
        .join('; ')}`,
    );
  }

  return data.collectionAddProducts.collection;
}

async function ensureTestCollection(admin, products, { dryRun = false } = {}) {
  const existing = await getTestCollection(admin);

  if (dryRun) {
    return {
      outcome: existing ? 'would-sync-existing' : 'would-create',
      id: existing?.id || null,
      title: existing?.title || 'Theme Test Catalog',
      handle: TEST_COLLECTION_HANDLE,
      products: products.length,
    };
  }

  const productIds = products.map(({ id }) => id);
  const collection = existing
    ? await addMissingCollectionProducts(admin, existing, productIds)
    : await createTestCollection(admin, productIds);

  return {
    outcome: existing ? 'synced-existing' : 'created',
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    products: collection.products.nodes.length,
  };
}

async function verifyPublicationExposure(admin, publications = null) {
  const currentPublications = publications || (await listPublications(admin));
  const aliases = TEST_PRODUCTS.map(
    ({ handle }, index) => `p${index}: productByIdentifier(
      identifier: { handle: ${JSON.stringify(handle)} }
    ) {
      handle
      publishedOnPublication(publicationId: $publicationId)
    }`,
  ).join('\n');
  const exposure = [];

  for (const publication of currentPublications) {
    const data = await adminGraphql(
      admin,
      `#graphql
        query ThemeTestCatalogPublicationExposure($publicationId: ID!) {
          ${aliases}
        }
      `,
      { publicationId: publication.id },
    );
    const visibleHandles = Object.values(data)
      .filter(({ publishedOnPublication }) => publishedOnPublication)
      .map(({ handle }) => handle);

    exposure.push({
      publicationId: publication.id,
      name: publication.name,
      visibleHandles,
    });
  }

  return {
    checked: true,
    publications: exposure,
    safe: exposure.every(({ visibleHandles }) => visibleHandles.length === 0),
  };
}

async function listPublications(admin) {
  const data = await adminGraphql(
    admin,
    `#graphql
      query ThemeTestCatalogPublications {
        publications(first: 50) {
          nodes {
            id
            name
            autoPublish
            supportsFuturePublishing
            catalog {
              id
              title
            }
            channels(first: 10) {
              nodes {
                id
                name
                handle
                app {
                  title
                }
              }
            }
          }
        }
      }
    `,
  );

  return data.publications.nodes;
}

function findOnlineStorePublication(publications) {
  const matches = publications.filter(
    (publication) =>
      publication.name === 'Online Store' &&
      publication.channels.nodes.some(
        (channel) =>
          channel.name === 'Online Store' && channel.handle === 'online_store',
      ),
  );

  if (matches.length !== 1) {
    throw new Error(
      `Expected one Online Store publication, found ${matches.length}.`,
    );
  }

  return matches[0];
}

async function getCollectionPublicationStatus(
  admin,
  collectionId,
  publicationId,
) {
  const data = await adminGraphql(
    admin,
    `#graphql
      query ThemeTestCollectionPublicationStatus(
        $collectionId: ID!
        $publicationId: ID!
      ) {
        collection(id: $collectionId) {
          id
          handle
          publishedOnPublication(publicationId: $publicationId)
        }
      }
    `,
    {
      collectionId,
      publicationId,
    },
  );

  return Boolean(data.collection?.publishedOnPublication);
}

async function publishResource(admin, id, publicationId) {
  const data = await adminGraphql(
    admin,
    `#graphql
      mutation PublishThemeTestResource(
        $id: ID!
        $input: [PublicationInput!]!
        $publicationId: ID!
      ) {
        publishablePublish(id: $id, input: $input) {
          publishable {
            publishedOnPublication(publicationId: $publicationId)
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      id,
      input: [{ publicationId }],
      publicationId,
    },
  );
  const errors = data.publishablePublish.userErrors;

  if (errors.length) {
    throw new Error(
      `Could not publish ${id}: ${errors
        .map(({ message }) => message)
        .join('; ')}`,
    );
  }

  if (!data.publishablePublish.publishable?.publishedOnPublication) {
    throw new Error(`Shopify did not confirm publication for ${id}.`);
  }
}

async function publishTestCatalogToOnlineStore(
  admin,
  products,
  collection,
  confirmPublication,
) {
  if (confirmPublication !== 'Online Store') {
    throw new Error(
      'Publishing requires --confirm-publication "Online Store".',
    );
  }

  const publications = await listPublications(admin);
  const onlineStore = findOnlineStorePublication(publications);
  const before = await verifyPublicationExposure(admin, publications);
  const unexpectedBefore = before.publications.filter(
    ({ publicationId, visibleHandles }) =>
      publicationId !== onlineStore.id && visibleHandles.length > 0,
  );

  if (unexpectedBefore.length) {
    throw new Error(
      'Safety check failed: test products are already visible outside Online Store.',
    );
  }

  const onlineStoreBefore = before.publications.find(
    ({ publicationId }) => publicationId === onlineStore.id,
  );
  const alreadyPublished = new Set(onlineStoreBefore?.visibleHandles || []);
  const publishedProducts = [];

  for (const product of products) {
    if (!alreadyPublished.has(product.handle)) {
      await publishResource(admin, product.id, onlineStore.id);
      publishedProducts.push(product.handle);
    }
  }

  const collectionWasPublished = await getCollectionPublicationStatus(
    admin,
    collection.id,
    onlineStore.id,
  );

  if (!collectionWasPublished) {
    await publishResource(admin, collection.id, onlineStore.id);
  }

  const after = await verifyPublicationExposure(admin, publications);
  const onlineStoreAfter = after.publications.find(
    ({ publicationId }) => publicationId === onlineStore.id,
  );
  const expectedHandles = new Set(TEST_PRODUCTS.map(({ handle }) => handle));
  const onlineStoreComplete =
    onlineStoreAfter?.visibleHandles.length === expectedHandles.size &&
    onlineStoreAfter.visibleHandles.every((handle) =>
      expectedHandles.has(handle),
    );
  const otherChannelsEmpty = after.publications
    .filter(({ publicationId }) => publicationId !== onlineStore.id)
    .every(({ visibleHandles }) => visibleHandles.length === 0);
  const collectionPublished = await getCollectionPublicationStatus(
    admin,
    collection.id,
    onlineStore.id,
  );

  if (!onlineStoreComplete || !otherChannelsEmpty || !collectionPublished) {
    throw new Error(
      'Post-publication verification failed. Inspect channel visibility before continuing.',
    );
  }

  return {
    publication: {
      id: onlineStore.id,
      name: onlineStore.name,
      channelHandle: 'online_store',
      autoPublish: onlineStore.autoPublish,
    },
    productsPublishedNow: publishedProducts,
    productsVisible: onlineStoreAfter.visibleHandles,
    collectionPublishedNow: !collectionWasPublished,
    collectionVisible: collectionPublished,
    otherPublications: after.publications
      .filter(({ publicationId }) => publicationId !== onlineStore.id)
      .map(({ publicationId, name, visibleHandles }) => ({
        publicationId,
        name,
        visibleTestProducts: visibleHandles,
      })),
    safe: true,
  };
}

function normalizeStorefrontDomain(value) {
  if (!value) return '';

  const withProtocol = value.match(/^https?:\/\//) ? value : `https://${value}`;
  return new URL(withProtocol).hostname.toLowerCase();
}

async function verifyHeadlessExposure(env) {
  const domain = normalizeStorefrontDomain(
    env.SHOPIFY_HEADLESS_STORE_DOMAIN ||
      env.SHOPIFY_STOREFRONT_DOMAIN ||
      env.SHOPIFY_DOMAIN,
  );
  const privateToken =
    env.SHOPIFY_HEADLESS_STOREFRONT_PRIVATE_TOKEN ||
    env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const publicToken =
    env.SHOPIFY_HEADLESS_STOREFRONT_PUBLIC_TOKEN ||
    env.SHOPIFY_HEADLESS_STOREFRONT_TOKEN ||
    env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
  const tokenCandidates = [
    privateToken
      ? {
          label: 'private',
          header: 'Shopify-Storefront-Private-Token',
          token: privateToken,
        }
      : null,
    publicToken
      ? {
          label: 'public',
          header: 'X-Shopify-Storefront-Access-Token',
          token: publicToken,
        }
      : null,
  ].filter(Boolean);

  if (!domain || tokenCandidates.length === 0) {
    return {
      checked: false,
      reason: 'No Storefront API domain/token was provided.',
    };
  }

  const aliases = TEST_PRODUCTS.map(
    ({ handle }, index) => `p${index}: product(handle: ${JSON.stringify(handle)}) {
      handle
    }`,
  ).join('\n');
  const failures = [];

  for (const candidate of tokenCandidates) {
    const response = await fetch(
      `https://${domain}/api/${API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [candidate.header]: candidate.token,
        },
        body: JSON.stringify({
          query: `#graphql
            query ThemeTestCatalogHeadlessExposure {
              ${aliases}
            }
          `,
        }),
      },
    );
    const result = await response.json();

    if (!response.ok || result.errors?.length) {
      failures.push({
        tokenType: candidate.label,
        reason:
          result.errors?.map(({ message }) => message).join('; ') ||
          `HTTP ${response.status}`,
      });
      continue;
    }

    const visibleHandles = Object.values(result.data)
      .filter(Boolean)
      .map(({ handle }) => handle);

    return {
      checked: true,
      domain,
      tokenType: candidate.label,
      apiVersion: API_VERSION,
      visibleHandles,
      safe: visibleHandles.length === 0,
    };
  }

  return {
    checked: false,
    reason: failures
      .map(({ tokenType, reason }) => `${tokenType} token: ${reason}`)
      .join('; '),
  };
}

function optionValue(args, flag) {
  const index = args.indexOf(flag);

  return index === -1 ? '' : args[index + 1] || '';
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';
  const envFile = optionValue(args, '--env-file') || '.env';
  const storefrontEnvFile = optionValue(args, '--storefront-env-file');
  const shop = optionValue(args, '--shop');
  const confirmShop = optionValue(args, '--confirm-shop');
  const confirmPublication = optionValue(args, '--confirm-publication');
  const dryRun = args.includes('--dry-run');

  if (
    !['check', 'list-publications', 'publish-online-store', 'seed'].includes(
      command,
    )
  ) {
    throw new Error(
      `Unknown command "${command}". Supported commands: check, list-publications, publish-online-store, seed.`,
    );
  }

  const env = {
    ...(storefrontEnvFile ? readEnvFile(storefrontEnvFile) : {}),
    ...readEnvFile(envFile),
    ...process.env,
  };

  if (shop) env.SHOPIFY_DOMAIN = shop;

  const admin = await getAdminAccess(env);
  const connection = await checkConnection(admin);

  if (command === 'check') {
    console.log(JSON.stringify(connection, null, 2));
    return;
  }

  if (command === 'list-publications') {
    if (!connection.canReadPublications) {
      throw new Error(
        'The installed app does not have read_publications access.',
      );
    }

    console.log(
      JSON.stringify(
        {
          shop: connection.shop,
          domain: connection.domain,
          publications: await listPublications(admin),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (!connection.canWriteProducts) {
    throw new Error('The installed app does not have write_products access.');
  }

  if (!dryRun) {
    if (!confirmShop) {
      throw new Error(
        'This command changes Shopify data. Pass --confirm-shop with the target *.myshopify.com domain.',
      );
    }

    if (normalizeShopDomain(confirmShop) !== admin.shop) {
      throw new Error(
        `The confirmed shop ${normalizeShopDomain(confirmShop)} does not match ${admin.shop}.`,
      );
    }
  }

  const products = await seedTestCatalog(admin, { dryRun });
  const collection = await ensureTestCollection(admin, products, { dryRun });

  if (command === 'publish-online-store') {
    if (dryRun) {
      throw new Error(
        'publish-online-store does not support --dry-run. Use list-publications and seed --dry-run for read-only checks.',
      );
    }

    if (!connection.canReadPublications || !connection.canWritePublications) {
      throw new Error(
        'The installed app needs read_publications and write_publications access.',
      );
    }

    const publication = await publishTestCatalogToOnlineStore(
      admin,
      products,
      collection,
      confirmPublication,
    );

    console.log(
      JSON.stringify(
        {
          mode: 'publish-online-store',
          shop: connection.shop,
          domain: connection.domain,
          tag: TEST_CATALOG_TAG,
          products,
          collection,
          publication,
        },
        null,
        2,
      ),
    );
    return;
  }

  const publicationExposure = dryRun
    ? { checked: false, reason: 'Dry run did not create products.' }
    : !connection.canReadPublications
      ? {
          checked: false,
          reason:
            'The installed app has not granted read_publications access yet.',
        }
    : await verifyPublicationExposure(admin);
  const storefrontExposure = dryRun
    ? { checked: false, reason: 'Dry run did not create products.' }
    : await verifyHeadlessExposure(env);

  if (publicationExposure.checked && !publicationExposure.safe) {
    throw new Error(
      'Safety check failed: at least one test product is visible on a configured publication.',
    );
  }

  if (storefrontExposure.checked && !storefrontExposure.safe) {
    throw new Error(
      `Safety check failed: these test products are visible through the Storefront API: ${storefrontExposure.visibleHandles.join(
        ', ',
      )}`,
    );
  }

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? 'dry-run' : 'seed',
        shop: connection.shop,
        domain: connection.domain,
        tag: TEST_CATALOG_TAG,
        products,
        collection,
        publicationExposure,
        storefrontExposure,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
