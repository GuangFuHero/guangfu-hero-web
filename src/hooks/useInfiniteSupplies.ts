import { getSupplies } from '@/lib/api';
import { createApiRequest } from '@/lib/apis/config';
import { SupplyResponse } from '@/lib/types';
import { SupplyProvider } from '@/lib/types/resource';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const queryKeys = {
  infiniteSupplies: () => ['infiniteSupplies'] as const,
};

export const useInfiniteSupplies = () => {
  // TODO:
  const [supplyProviders] = useState<Record<string, SupplyProvider[]>>({});

  const infiniteQuery = useInfiniteQuery({
    enabled: true,
    queryKey: queryKeys.infiniteSupplies(),
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      try {
        if (pageParam) {
          return await createApiRequest<SupplyResponse>(pageParam);
        }
        return await getSupplies(50, 0);
      } catch (error) {
        console.error('❌ API 請求失敗:', error);
        throw error;
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: SupplyResponse) => {
      return lastPage.next || undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  //   const ensureProvidersForRequests = async (requestList: Supply[]) => {
  //     const supplyIds = new Set<string>();
  //     requestList.forEach(req => {
  //       if (isCompleted(req)) return;
  //       (req.supplies || []).forEach(item => {
  //         if (remainingNeed(item) === 0) return;
  //         if (item?.id) supplyIds.add(item.id);
  //       });
  //     });
  //     const idsToFetch = Array.from(supplyIds).filter(id => id && supplyProviders[id] === undefined);
  //     if (idsToFetch.length === 0) return;
  //     const results = await Promise.allSettled(
  //       idsToFetch.map(async id => {
  //         const providers = await fetchSupplyProviders(id);
  //         return { id, providers };
  //       })
  //     );
  //     const newProviders: Record<string, SupplyProvider[]> = {};
  //     results.forEach(result => {
  //       if (result.status === 'fulfilled') {
  //         newProviders[result.value.id] = result.value.providers;
  //       }
  //     });
  //     setSupplyProviders(prev => ({ ...prev, ...newProviders }));
  //   };

  //   const allRequests: Supply[] = infiniteQuery?.data?.pages.flatMap(page => page.member) || [];

  //   useEffect(() => {
  //     if (allRequests.length > 0) {
  //       ensureProvidersForRequests(allRequests);
  //     }
  //   }, [allRequests]);

  return {
    ...infiniteQuery,
    supplyProviders,
  };
};
