// Ansh JEE — Site Configuration
// Edit this file to configure site-wide settings.
// Never put secrets, API keys, or credentials here.

export const SITE_NAME = 'Ansh JEE';
export const SITE_TAGLINE = 'Everything a JEE aspirant needs. One place.';
export const CREATOR = 'Maatriansh';
export const FOOTER_CREDIT = 'Made with ♥ from Maatriansh';

// SEO
export const SITE_DESCRIPTION =
  'A focused preparation space for JEE aspirants — learn, practice, solve PYQs, take tests, focus, and track progress.';

// Production domain(s) — used for domain allow-list security check.
// Add your Netlify domain or custom domain here when deploying.
// Localhost and 127.0.0.1 are always allowed in development.
export const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  // 'your-site.netlify.app',
  // 'anshjee.in',
];

// External community links — leave empty string to hide.
export const EXTERNAL_LINKS = {
  telegram: '',
  youtube: '',
  instagram: '',
};

// JEE exam countdown — leave empty string to hide the countdown.
// Format: ISO 8601 date string, e.g. '2026-01-22T09:00:00+05:30'
export const EXAM_DATE = '';

// Set to true during development to show the interface demo test.
// MUST be false in production — no demo data should reach users.
export const SHOW_DEMO_CONTENT = true;
