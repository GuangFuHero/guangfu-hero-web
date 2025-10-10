'use client';

import {
  getAccommodations,
  getMedicalStations,
  getRestrooms,
  getShowerStations,
  getWaterStations,
} from '@/apis';
import { Accommodation } from '@/types/accommodation';

import { useToast } from '@/providers/ToastProvider';
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

export const useMapData = () => {
  const { showToast } = useToast();
  const accommodationsQuery = useAccommodations();
  const waterStationsQuery = useWaterStations();
  const restroomsQuery = useRestrooms();
  const showerStationsQuery = useShowerStations();
  const medicalStationsQuery = useMedicalStations();

  const isLoading =
    accommodationsQuery.isLoading ||
    waterStationsQuery.isLoading ||
    restroomsQuery.isLoading ||
    showerStationsQuery.isLoading ||
    medicalStationsQuery.isLoading;

  const error =
    accommodationsQuery.error ||
    waterStationsQuery.error ||
    restroomsQuery.error ||
    showerStationsQuery.error ||
    medicalStationsQuery.error;

  const refetch = () => {
    accommodationsQuery.refetch();
    waterStationsQuery.refetch();
    restroomsQuery.refetch();
    showerStationsQuery.refetch();
    medicalStationsQuery.refetch();
  };

  // 顯示載入成功的 toast
  const showSuccessToasts = () => {
    console.log('資料獲取成功');
  };

  // 當所有查詢完成時顯示成功 toast
  if (!isLoading && !error) {
    setTimeout(showSuccessToasts, 100);
  }

  // 處理錯誤
  if (error && !isLoading) {
    console.log('資料獲取失敗');
    const errorMessage =
      error instanceof Error ? error.message : '載入地圖資料失敗';
    showToast(errorMessage, 'error');
  }

  return {
    isLoading,
    error: error ? (error instanceof Error ? error.message : '載入失敗') : null,
    refetch,
  };
};
