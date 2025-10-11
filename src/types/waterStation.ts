import { Coordinates } from './common';

export interface WaterStation {
  id: string;
  name: string;
  address: string;
  coordinates?: Coordinates;
  phone?: string;
  water_type: 'drinking_water' | 'bottled_water' | 'filtered_water';
  opening_hours: string;
  is_free: boolean;
  container_required?: string;
  daily_capacity?: number;
  status: 'active' | 'temporarily_unavailable' | 'ended';
  water_quality?: 'tested' | 'safe' | 'needs_boiling';
  facilities?: string[];
  accessibility: boolean;
  distance_to_disaster_area?: string;
  notes?: string;
  info_source?: string;
  created_at: number;
  updated_at: number;
}
