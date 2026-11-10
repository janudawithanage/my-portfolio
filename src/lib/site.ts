/**
 * Public origin of the deployed site, used for canonical, social-preview and sitemap URLs.
 * Set NEXT_PUBLIC_SITE_URL (for example https://example.com). On Vercel the production
 * domain is picked up automatically. Undefined when neither exists, such as local development.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const configured = process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? "https://" + vercelHost : undefined);

export const siteUrl = configured?.replace(/\/+$/, "");
