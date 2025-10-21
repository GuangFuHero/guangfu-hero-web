import { env } from '@/config/env';
import {
  ReportRequest,
  ReportResponse,
  ReportSupplyProvider,
  ReportSupplyProviderResponse,
  SupplyResponse,
} from './types';

// TODO: use for volunteer register page, wait for refactor
export const getEditApiUrl = () => env.NEXT_PUBLIC_API_URL;

export async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const base = env.NEXT_PUBLIC_API_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${base}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function submitReport(data: ReportRequest): Promise<ReportResponse> {
  const base = getEditApiUrl();
  const response = await fetch(`${base}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('提交失敗,請稍後再試');
  }

  return response.json();
}

export async function getSupplies(limit: number = 50, offset: number = 0): Promise<SupplyResponse> {
  const response = await fetchAPI<SupplyResponse>('/supplies', {
    embed: 'all',
    limit,
    offset,
    // filterOutComplete: "true",
  });
  return response;
}

export async function submitSupplyProvider(
  data: ReportSupplyProvider,
  lineIdToken: string
): Promise<ReportSupplyProviderResponse> {
  if (!lineIdToken) {
    throw new Error('登入資訊有問題，請重新登入');
  }

  const base = getEditApiUrl();
  const response = await fetch(`${base}/supply_providers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${lineIdToken}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('提交失敗,請稍後再試');
  }

  return response.json();
}
