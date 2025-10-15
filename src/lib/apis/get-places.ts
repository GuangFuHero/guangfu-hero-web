import { PlacesResponse, PlaceType } from '@/lib/types/place';
import { fetchAPI } from '../api';

export const getPlacesAsync = async (type?: PlaceType): Promise<PlacesResponse> => {
  const params: Record<string, string | number> = {
    status: '開放',
  };
  if (type) params.type = type;
  return fetchAPI<PlacesResponse>('/places', params);
};
