import { Restroom } from '@/types/restroom';
import { fetchAllItemsApiRequest } from './config';

export const getRestrooms = async (): Promise<{ member: Restroom[] }> => {
  return fetchAllItemsApiRequest('/restrooms');
};
