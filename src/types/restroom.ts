import { Coordinates } from './common';

export interface Restroom {
  id: string;
  name: string;
  address: string;
  coordinates?: Coordinates;
  phone?: string;
  facility_type: 'mobile_toilet' | 'permanent_toilet' | 'public_restroom';
  opening_hours: string;
  is_free: boolean;
  male_units?: number;
  female_units?: number;
  unisex_units?: number;
  accessible_units?: number;
  has_water: boolean;
  has_lighting: boolean;
  status: 'active' | 'maintenance' | 'out_of_service';
  cleanliness?: 'clean' | 'needs_cleaning' | 'under_cleaning';
  last_cleaned?: number;
  facilities?: string[];
  distance_to_disaster_area?: string;
  notes?: string;
  info_source?: string;
  created_at: number;
  updated_at: number;
}
