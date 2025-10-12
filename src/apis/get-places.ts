import { Place } from '@/types/place';
import { fetchAllItemsApiRequest } from './config';

export const getPlacesAsync = async (): Promise<{
  member: Place[];
}> => {
  return fetchAllItemsApiRequest<Place>(`/places?status=${encodeURIComponent('開放')}`);
};
