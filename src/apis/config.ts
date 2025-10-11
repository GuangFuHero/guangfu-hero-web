import { env } from '@/config/env';
export const API_URL = env.NEXT_PUBLIC_API_URL;

export const createApiRequest = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

export const fetchAllItemsApiRequest = async <T>(endpoint: string, options?: RequestInit) => {
  try {
    let allData: T[] = [];
    let nextUrl: string | null = `${API_URL}${endpoint}`;

    while (nextUrl) {
      const response: Response = await fetch(nextUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { member: T[]; next?: string } = await response.json();

      // 將當前頁面的數據加入總數據中
      if (data.member && Array.isArray(data.member)) {
        allData = allData.concat(data.member);
      }

      // 檢查是否有下一頁
      if (data.next) {
        nextUrl = `${API_URL}${data.next}`;
      } else {
        nextUrl = null;
      }
    }

    return {
      member: allData,
      total: allData.length,
    };
  } catch (error) {
    console.error(`Error fetching paginated data from ${endpoint}:`, error);
    throw error;
  }
};
