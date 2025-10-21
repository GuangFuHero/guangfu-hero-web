import { getSupplies } from '@/lib/api';
import { Supply, SupplyItem } from '@/lib/types';
import { env } from '@/config/env';
import { useCallback, useEffect, useRef, useState } from 'react';
// import mock from "@/lib/mock.json";

const LIMIT = 50;

export type NormalizedSupplyItem = SupplyItem & {
  requestor: string;
  address: string;
  updated_at: number;
};

export const useFetchAllData = (authed: boolean) => {
  const [supplies, setSupplies] = useState<NormalizedSupplyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const totalItemsRef = useRef(0);

  // Fetch first batch
  useEffect(() => {
    const fetchFirstBatch = async () => {
      if (!authed) return;

      setLoading(true);
      setError(null);
      offsetRef.current = 0;

      try {
        // const response = mock;
        const response = await getSupplies(LIMIT, 0);

        setSupplies(normalizeData(response.member));
        totalItemsRef.current = response.totalItems;
        offsetRef.current = LIMIT;
        setHasMore(response.member.length < response.totalItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入物資資料時發生錯誤');
        console.error('Failed to fetch supplies after retries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstBatch();
  }, [authed]);

  // Function to fetch next batch
  const fetchNextBatch = useCallback(async () => {
    if (!authed || loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const response = await getSupplies(LIMIT, offsetRef.current);

      setSupplies(prev => [...prev, ...normalizeData(response.member)]);
      offsetRef.current += LIMIT;
      setHasMore(offsetRef.current < totalItemsRef.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入更多物資資料時發生錯誤');
      console.error('Failed to fetch more supplies after retries:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [authed, loadingMore, hasMore]);

  return {
    supplies,
    loading,
    loadingMore,
    error,
    hasMore,
    fetchNextBatch,
  };
};

function normalizeData(data: Supply[]): NormalizedSupplyItem[] {
  const supplySet = [] as NormalizedSupplyItem[];
  data.map(({ supplies, address, name, updated_at }) => {
    supplies.forEach(s => {
      // the two field names are different between old/new API
      // to check whether the proper data are brought
      const total = env.IS_USE_NEW_API ? (s.total_number ?? -1) : (s.total_count ?? -1);
      const received = env.IS_USE_NEW_API ? (s.received_count ?? -1) : (s.recieved_count ?? -1);
      if (total === -1 || received === -1) return;

      if (total > received) {
        supplySet.push({
          ...s,
          requestor: name,
          address,
          updated_at,
        });
      }
    });
  });
  return supplySet;
}
