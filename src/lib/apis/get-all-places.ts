import { Place } from '@/lib/types/place';
import { fetchAllItemsApiRequest } from './config';

export const getAllPlacesAsync = async (): Promise<{
  member: Place[];
}> => {
  return fetchAllItemsApiRequest<Place>(`/places?status=${encodeURIComponent('開放')}`);
};
