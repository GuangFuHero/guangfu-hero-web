'use client';

import {
  getAccommodations,
  getMedicalStations,
  getRestrooms,
  getShowerStations,
  getWaterStations,
} from '@/apis';
import { Accommodation } from '@/types/accommodation';

import { MedicalStation } from '@/types/medicalStation';
import { Restroom } from '@/types/restroom';
import { ShowerStation } from '@/types/showerStation';
import { WaterStation } from '@/types/waterStation';
import { useQuery } from '@tanstack/react-query';

// Query Keys
export const queryKeys = {
  accommodations: ['accommodations'] as const,
  waterStations: ['waterStations'] as const,
  restrooms: ['restrooms'] as const,
  showerStations: ['showerStations'] as const,
  medicalStations: ['medicalStations'] as const,
  allData: ['allData'] as const,
};

// 住宿點數據
export const useAccommodations = () => {
  return useQuery({
    queryKey: queryKeys.accommodations,
    queryFn: async (): Promise<Accommodation[]> => {
      const response = await getAccommodations();
      return response.member || [];
    },
    staleTime: 5 * 60 * 1000, // 5 分鐘
    gcTime: 10 * 60 * 1000, // 10 分鐘
  });
};

// 加水站數據
export const useWaterStations = () => {
  return useQuery({
    queryKey: queryKeys.waterStations,
    queryFn: async (): Promise<WaterStation[]> => {
      const response = await getWaterStations();
      return response.member || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 廁所數據
export const useRestrooms = () => {
  return useQuery({
    queryKey: queryKeys.restrooms,
    queryFn: async (): Promise<Restroom[]> => {
      const response = await getRestrooms();
      return response.member || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 洗澡點數據
export const useShowerStations = () => {
  return useQuery({
    queryKey: queryKeys.showerStations,
    queryFn: async (): Promise<ShowerStation[]> => {
      const response = await getShowerStations();
      return response.member || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 醫療站數據
export const useMedicalStations = () => {
  return useQuery({
    queryKey: queryKeys.medicalStations,
    queryFn: async (): Promise<MedicalStation[]> => {
      const response = await getMedicalStations();
      return response.member || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
