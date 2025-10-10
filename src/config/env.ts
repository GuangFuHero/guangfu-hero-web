/**
 * Environment configuration
 * Centralized place to manage all environment variables
 */

export const env = {
  // https://gf250923.org (Production)
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || "",
} as const;

export type EnvConfig = typeof env;
