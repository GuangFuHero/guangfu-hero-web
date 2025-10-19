/**
 * Environment configuration
 * Centralized place to manage all environment variables
 */

export const env = {
  // https://gf250923.org (Production)
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || '',

  // API related
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.gf250923.org',
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',
  NEXT_PUBLIC_API_KEY_DEV: process.env.NEXT_PUBLIC_API_KEY_DEV || '',

  // outsource data
  NEXT_PUBLIC_GOOGLE_SHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
} as const;

export type EnvConfig = typeof env;
