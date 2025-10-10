'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  useAccommodations,
  useMedicalStations,
  useRestrooms,
  useShowerStations,
  useWaterStations,
} from './useMapData';

export const useMapQueries = () => {
  const queryClient = useQueryClient();

  useAccommodations();
  useWaterStations();
  useRestrooms();
  useShowerStations();
  useMedicalStations();

  return queryClient;
};
