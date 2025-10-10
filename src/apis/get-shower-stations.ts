import { ShowerStation } from '@/types/showerStation';
import { fetchAllItemsApiRequest } from './config';

export const getShowerStations = async (): Promise<{
  member: ShowerStation[];
}> => {
  return fetchAllItemsApiRequest('/shower_stations');
};
