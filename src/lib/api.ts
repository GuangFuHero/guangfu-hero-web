const API_BASE_URL = "https://guangfu250923.pttapp.cc";
const isProd = process.env.NODE_ENV === "production";

export async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const base = isProd ? API_BASE_URL : `${window.location.origin}/api`; // dev should have /api for proxy
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${base}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

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
  "@context": string;
  "@type": string;
  limit: number;
  member: Accommodations[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export async function getAccommodations(
  limit: number = 50,
  offset: number = 0
): Promise<AccommodationsResponse> {
  return fetchAPI<AccommodationsResponse>("/accommodations", {
    limit,
    offset,
  });
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
  "@context": string;
  "@type": string;
  limit: number;
  member: RestRooms[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export async function getRestrooms(
  limit: number = 50,
  offset: number = 0
): Promise<RestRoomsResponse> {
  return fetchAPI<RestRoomsResponse>("/restrooms", {
    limit,
    offset,
  });
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
  "@context": string;
  "@type": string;
  limit: number;
  member: ShowerStations[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export async function getShowerStations(
  limit: number = 50,
  offset: number = 0
): Promise<ShowerStationsResponse> {
  return fetchAPI<ShowerStationsResponse>("/shower_stations", {
    limit,
    offset,
  });
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
  "@context": string;
  "@type": string;
  limit: number;
  member: WaterRefillStations[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export async function getWaterRefillStations(
  limit: number = 50,
  offset: number = 0
): Promise<WaterRefillStationsResponse> {
  return fetchAPI<WaterRefillStationsResponse>("/water_refill_stations", {
    limit,
    offset,
  });
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
  "@context": string;
  "@type": string;
  limit: number;
  member: Shelter[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export async function getShelters(
  limit: number = 50,
  offset: number = 0
): Promise<ShelterResponse> {
  return fetchAPI<ShelterResponse>("/shelters", { limit, offset });
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
  "@context": string;
  "@type": string;
  limit: number;
  member: MedicalStation[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export async function getMedicalStations(
  limit: number = 50,
  offset: number = 0
): Promise<MedicalStationResponse> {
  return fetchAPI<MedicalStationResponse>("/medical_stations", {
    limit,
    offset,
  });
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
  "@context": string;
  "@type": string;
  limit: number;
  member: MentalHealthResource[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}

export async function getMentalHealthResources(
  limit: number = 50,
  offset: number = 0
): Promise<MentalHealthResourceResponse> {
  return fetchAPI<MentalHealthResourceResponse>("/mental_health_resources", {
    limit,
    offset,
  });
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

export async function submitReport(
  data: ReportRequest
): Promise<ReportResponse> {
  const base = isProd ? API_BASE_URL : `${window.location.origin}/api`; // dev should have /api for proxy
  const url = `${base}/reports`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("提交失敗，請稍後再試");
  }

  return response.json();
}
