/**
 * Environment configuration
 * Centralized place to manage all environment variables
 */

const local_test_api_url = 'https://api.gf250923.org'; // https://guangfu250923.pttapp.cc

export const env = {
  // https://gf250923.org (Production)
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || '',

  // API related
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || local_test_api_url,
  IS_USE_NEW_API: (process.env.NEXT_PUBLIC_API_URL || local_test_api_url).includes(
    'api.gf250923.org'
  ),
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',
  NEXT_PUBLIC_API_KEY_DEV: process.env.NEXT_PUBLIC_API_KEY_DEV || '',
} as const;

export type EnvConfig = typeof env;
