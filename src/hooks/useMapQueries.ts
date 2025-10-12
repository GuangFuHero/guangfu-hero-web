'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePlaces } from './useMapData';

export const useMapQueries = () => {
  const queryClient = useQueryClient();

  usePlaces();

  return queryClient;
};
