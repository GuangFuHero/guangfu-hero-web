'use client';

import { getAllPlacesAsync } from '@/lib/apis';
import { createApiRequest } from '@/lib/apis/config';
import { getPlacesAsync } from '@/lib/apis/get-places';

import { Place, PlaceType, PlacesResponse } from '@/lib/types/place';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const queryKeys = {
  allPlaces: ['places'] as const,
  infinitePlaces: (type?: PlaceType | 'all') => [type || 'all'] as const,
};

export const useAllPlaces = () => {
  return useQuery({
    queryKey: queryKeys.allPlaces,
    queryFn: async (): Promise<Record<PlaceType | string, Place[]>> => {
      const response = await getAllPlacesAsync();
      const places = response?.member || [];

      const defaultGroupedPlaces: Record<string, Place[]> = {};

      Object.values(PlaceType).forEach(type => {
        defaultGroupedPlaces[type] = [];
      });

      const groupedPlaces = places.reduce((acc: Record<string, Place[]>, place: Place) => {
        const type = place.type;
        if (Array.isArray(acc[type])) {
          acc[type].push(place);
        }
        return acc;
      }, defaultGroupedPlaces);

      return groupedPlaces;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useInfinitePlaces = (type?: PlaceType | 'all') => {
  const infiniteQuery = useInfiniteQuery({
    enabled: true,
    queryKey: queryKeys.infinitePlaces(type),
    queryFn: async ({ pageParam }: { pageParam?: string }): Promise<PlacesResponse> => {
      try {
        if (pageParam) {
          return await createApiRequest<PlacesResponse>(pageParam);
        }
        const apiType = type === 'all' ? undefined : type;
        return await getPlacesAsync(apiType);
      } catch (error) {
        console.error('❌ API 請求失敗:', error);
        throw error;
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: PlacesResponse) => {
      return lastPage.next || undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const flatData = infiniteQuery.data?.pages.flatMap(page => page.member) || [];

  const groupedData: Record<PlaceType, Place[]> = Object.values(PlaceType).reduce(
    (acc, placeType) => {
      acc[placeType] = [];
      return acc;
    },
    {} as Record<PlaceType, Place[]>
  );

  flatData.forEach(place => {
    if (groupedData[place.type]) {
      groupedData[place.type].push(place);
    }
  });

  return {
    ...infiniteQuery,
    data: groupedData,
    flatData,
  };
};
