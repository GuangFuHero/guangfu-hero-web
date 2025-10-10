import { WaterStation } from '@/types/waterStation';
import { fetchAllItemsApiRequest } from './config';

export const getWaterStations = async (): Promise<{
  member: WaterStation[];
}> => {
  return fetchAllItemsApiRequest<WaterStation>('/water_refill_stations');
};
