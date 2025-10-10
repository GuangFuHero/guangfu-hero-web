import { Coordinates } from './common';

export interface GenderSchedule {
  male?: string[];
  female?: string[];
}

export interface ShowerStation {
  id: string;
  name: string;
  address: string;
  coordinates?: Coordinates;
  phone?: string;
  facility_type: 'mobile_shower' | 'coin_operated' | 'regular_bathroom';
  time_slots: string;
  gender_schedule?: GenderSchedule;
  available_period: string;
  capacity?: number;
  is_free: boolean;
  pricing?: string;
  notes?: string;
  info_source?: string;
  status: 'active' | 'temporarily_closed' | 'ended';
  facilities?: string[];
  distance_to_guangfu?: string;
  requires_appointment: boolean;
  contact_method?: string;
  created_at: number;
  updated_at: number;
}
