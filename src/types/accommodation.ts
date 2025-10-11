import { Coordinates } from './common';

export interface Accommodation {
  id: string;
  township: string;
  name: string;
  has_vacancy: 'available' | 'full' | 'unknown' | 'need_confirm';
  available_period: string;
  restrictions?: string;
  contact_info: string;
  room_info?: string;
  address: string;
  coordinates?: Coordinates;
  pricing: string;
  info_source?: string;
  notes?: string;
  capacity?: number;
  status: 'active' | 'paused' | 'ended';
  registration_method?: string;
  facilities?: string[];
  distance_to_disaster_area?: string;
  created_at: number;
  updated_at: number;
}
