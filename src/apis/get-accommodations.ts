import { Accommodation } from '@/types/accommodation';
import { fetchAllItemsApiRequest } from './config';

export const getAccommodations = async (): Promise<{
  member: Accommodation[];
}> => {
  return fetchAllItemsApiRequest<Accommodation>('/accommodations');
};
