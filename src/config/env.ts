/**
 * Environment configuration
 * Centralized place to manage all environment variables
 */

export const env = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || '',
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || '',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://guangfu250923.pttapp.cc',
} as const;

export type EnvConfig = typeof env;
