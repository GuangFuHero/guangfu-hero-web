import { getHumanResources } from '@/lib/api';
import { createApiRequest } from '@/lib/apis/config';
import { HumanResource, HumanResourceResponse } from '@/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';

export const queryKeys = {
  infiniteHumanResource: (status: string, q_role: string) =>
    ['infiniteHumanResource', status, q_role] as const,
};

export const useInfiniteHumanResource = (status: string, q_role: string) => {
  const infiniteQuery = useInfiniteQuery({
    enabled: true,
    queryKey: queryKeys.infiniteHumanResource(status, q_role),
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      try {
        if (pageParam) {
          return await createApiRequest<HumanResourceResponse>(pageParam);
        }
        return await getHumanResources(status, q_role, 50, 0);
      } catch (error) {
        console.error('❌ API 請求失敗:', error);
        throw error;
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: HumanResourceResponse) => {
      return lastPage.next || undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const displayedData: HumanResource[] =
    infiniteQuery?.data?.pages.flatMap(page => page.member) || [];
  const totalItems =
    infiniteQuery?.data?.pages[infiniteQuery.data.pages.length - 1]?.totalItems ||
    displayedData.length;

  return {
    ...infiniteQuery,
    displayedData,
    totalItems,
  };
};
