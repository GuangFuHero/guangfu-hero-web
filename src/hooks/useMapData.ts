'use client';

import { getPlacesAsync } from '@/apis';

import { Place, PlaceType } from '@/types/place';
import { useQuery } from '@tanstack/react-query';

export const queryKeys = {
  places: ['places'] as const,
};

export const usePlaces = () => {
  return useQuery({
    queryKey: queryKeys.places,
    queryFn: async (): Promise<Record<PlaceType | string, Place[]>> => {
      const response = await getPlacesAsync();
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
