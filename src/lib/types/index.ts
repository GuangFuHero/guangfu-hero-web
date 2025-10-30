export interface Accommodations {
  id: string;
  name: string;
  location: string;
  phone: string;
  status: string;
  facilities: string | null;
  notes: string | null;
  opening_hours: string | null;
  is_free: boolean;
  contact_info: string;
  available_period: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  created_at: number;
  updated_at: number;
}

export interface AccommodationsResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: Accommodations[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}
export interface RestRooms {
  id: string;
  name: string;
  location: string;
  phone: string;
  status: string;
  facilities: string | null;
  notes: string | null;
  opening_hours: string | null;
  is_free: boolean;
  facility_type: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  created_at: number;
  updated_at: number;
}

export interface RestRoomsResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: RestRooms[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export interface ShowerStations {
  id: string;
  name: string;
  location: string;
  phone: string;
  status: string;
  facilities: string | null;
  notes: string | null;
  opening_hours: string | null;
  is_free: boolean;
  facility_type: string;
  time_slots: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  created_at: number;
  updated_at: number;
}

export interface ShowerStationsResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: ShowerStations[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export interface WaterRefillStations {
  id: string;
  name: string;
  location: string;
  water_type: string;
  phone: string;
  status: string;
  facilities: string | null;
  notes: string | null;
  opening_hours: string | null;
  is_free: boolean;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  created_at: number;
  updated_at: number;
}

export interface WaterRefillStationsResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: WaterRefillStations[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  phone: string;
  link: string | null;
  status: string;
  capacity: number | null;
  current_occupancy: number | null;
  available_spaces: number | null;
  facilities: string[] | null;
  contact_person: string;
  notes: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  opening_hours: string | null;
  created_at: number;
  updated_at: number;
}

export interface ShelterResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: Shelter[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export interface MedicalStation {
  id: string;
  station_type: string;
  name: string;
  location: string;
  detailed_address: string;
  phone: string;
  contact_person: string;
  status: string;
  services: string[];
  operating_hours: string;
  equipment: string[];
  medical_staff: number;
  daily_capacity: number;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  affiliated_organization: string;
  notes: string | null;
  info_source: string | null;
  created_at: number;
  updated_at: number;
  address: string;
  water_type: string;
  opening_hours: string;
  is_free: true;
  container_required: null;
  water_quality: null;
  facilities: null;
  accessibility: true;
  distance_to_disaster_area: null;
}

export interface MedicalStationResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: MedicalStation[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export interface MentalHealthResource {
  id: string;
  duration_type: string;
  name: string;
  service_format: string;
  service_hours: string;
  contact_info: string;
  website_url: string;
  target_audience: string[];
  specialties: string[];
  languages: string[];
  is_free: boolean;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  status: string;
  capacity: number;
  waiting_time: string;
  notes: string;
  emergency_support: boolean;
  created_at: number;
  updated_at: number;
}

export interface MentalHealthResourceResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: MentalHealthResource[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export interface ReportRequest {
  name: string;
  location_type: string;
  location_id: string;
  reason: string;
  notes?: string;
  status: string;
}

export interface ReportResponse {
  id: string;
  name: string;
  location_type: string;
  location_id: string;
  reason: string;
  notes: string;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface SupplyResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: Supply[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export interface Supply {
  address: string;
  created_at: number;
  id: string;
  name: string;
  notes: string | null;
  phone: string;
  pii_date: number | null;
  supplies: SupplyItem[];
  updated_at: number;
}

export interface SupplyItem {
  id: string;
  supply_id: string;
  tag: string;
  name: string;
  recieved_count: number | null; // defined in old API
  received_count: number | null; // defined in new API
  total_count: number | null; // defined in old API
  total_number: number | null; // defined in new API
  unit: string;
}

export interface ReportSupplyProvider {
  name: string;
  address: string;
  phone: string;
  notes: string;
  supply_item_id: string;
  provide_unit: string;
  provide_count: number;
  pii_date: number;
}
export interface ReportSupplyProviderResponse {
  name: string;
  address: string;
  phone: string;
  notes: string;
  supply_item_id: string;
  provide_unit: string;
  provide_count: number;
  pii_date: number;
  id: string;
}
