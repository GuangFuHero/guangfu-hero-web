import { Coordinates } from './common';

export interface MedicalStation {
  id: string;
  station_type: 'self_organized' | 'fixed_point' | 'shelter_medical';
  name: string;
  location?: string;
  detailed_address?: string;
  phone?: string;
  contact_person?: string;
  status: 'active' | 'temporarily_closed' | 'closed';
  services?: string[];
  operating_hours?: string;
  equipment?: string[];
  medical_staff?: number;
  daily_capacity?: number;
  coordinates?: Coordinates;
  affiliated_organization?: string;
  notes?: string;
  link?: string;
  created_at: number;
  updated_at: number;
}
