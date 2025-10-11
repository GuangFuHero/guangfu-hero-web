import { MedicalStation } from '@/types/medicalStation';
import { fetchAllItemsApiRequest } from './config';

export const getMedicalStations = async (): Promise<{
  member: MedicalStation[];
}> => {
  return fetchAllItemsApiRequest<MedicalStation>('/medical_stations');
};
