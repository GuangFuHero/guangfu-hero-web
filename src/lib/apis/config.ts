import { fetchAPI } from '@/lib/api';

export const createApiRequest = async <T>(
  endpoint: string,
  params?: Record<string, string | number>
) => {
  try {
    return await fetchAPI<T>(endpoint, params);
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

export const fetchAllItemsApiRequest = async <T>(
  endpoint: string,
  params?: Record<string, string | number>
) => {
  let allData: T[] = [];
  try {
    let currentEndpoint = endpoint;
    let hasMore = true;

    while (hasMore) {
      const data: { member: T[]; next?: string; total?: number } = await fetchAPI(
        currentEndpoint,
        params
      );

      if (data.member && Array.isArray(data.member)) {
        allData = allData.concat(data.member);
      }

      if (data.next) {
        currentEndpoint = data.next;
      } else {
        hasMore = false;
      }
    }

    return {
      member: allData,
      total: allData.length,
    };
  } catch (error) {
    console.error(`Error fetching paginated data from ${endpoint}:`, error);
    return { member: allData, total: allData.length };
  }
};
