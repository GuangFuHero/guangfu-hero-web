import {
  AccommodationsResponse,
  MedicalStation,
  MedicalStationResponse,
  MentalHealthResource,
  MentalHealthResourceResponse,
  ReportRequest,
  ReportResponse,
  ReportSupplyProvider,
  ReportSupplyProviderResponse,
  RestRoomsResponse,
  Shelter,
  ShelterResponse,
  ShowerStationsResponse,
  SupplyResponse,
  WaterRefillStationsResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.gf250923.org';
const isProd = process.env.NODE_ENV === 'production';

export async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  let base: string;

  if (isProd) base = API_BASE_URL;
  else base = `${window.location.origin}/devapi`;

  const url = new URL(`${base}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getAccommodations(
  limit: number = 50,
  offset: number = 0
): Promise<AccommodationsResponse> {
  return fetchAPI<AccommodationsResponse>('/accommodations', {
    limit,
    offset,
  });
}

export async function getRestrooms(
  limit: number = 50,
  offset: number = 0
): Promise<RestRoomsResponse> {
  return fetchAPI<RestRoomsResponse>('/restrooms', {
    limit,
    offset,
  });
}

export async function getShowerStations(
  limit: number = 50,
  offset: number = 0
): Promise<ShowerStationsResponse> {
  return fetchAPI<ShowerStationsResponse>('/shower_stations', {
    limit,
    offset,
  });
}

export async function getWaterRefillStations(
  limit: number = 50,
  offset: number = 0
): Promise<WaterRefillStationsResponse> {
  return fetchAPI<WaterRefillStationsResponse>('/water_refill_stations', {
    limit,
    offset,
  });
}

export async function getShelters(
  limit: number = 50,
  offset: number = 0
): Promise<ShelterResponse> {
  const response = await fetchAPI<ShelterResponse>('/shelters', {
    limit,
    offset,
  });
  return {
    ...response,
    member: filterValidLocations(response.member as Shelter[]) as Shelter[],
  };
}

export async function getMedicalStations(
  limit: number = 50,
  offset: number = 0
): Promise<MedicalStationResponse> {
  const response = await fetchAPI<MedicalStationResponse>('/medical_stations', {
    limit,
    offset,
  });
  return {
    ...response,
    member: filterValidLocations(response.member as MedicalStation[]) as MedicalStation[],
  };
}

export async function getMentalHealthResources(
  limit: number = 50,
  offset: number = 0
): Promise<MentalHealthResourceResponse> {
  const response = await fetchAPI<MentalHealthResourceResponse>('/mental_health_resources', {
    limit,
    offset,
  });
  return {
    ...response,
    member: filterValidLocations(
      response.member as MentalHealthResource[]
    ) as MentalHealthResource[],
  };
}

export async function submitReport(data: ReportRequest): Promise<ReportResponse> {
  const base = isProd ? API_BASE_URL : `${window.location.origin}/api`; // dev should have /api for proxy
  const response = await fetch(`${base}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('提交失敗,請稍後再試');
  }

  return response.json();
}

type Location = (MentalHealthResource | MedicalStation | Shelter)[];
function filterValidLocations(locations: Location): Location {
  return locations.filter(
    location =>
      location.status !== 'test' && location.status !== 'need_delete' && location.name !== ''
  );
}

export async function getSupplies(limit: number = 50, offset: number = 0): Promise<SupplyResponse> {
  const response = await fetchAPI<SupplyResponse>('/supplies', {
    embed: 'all',
    limit,
    offset,
    // filterOutComplete: "true",
  });
  return response;
}

export async function submitSupplyProvider(
  data: ReportSupplyProvider,
  lineIdToken: string
): Promise<ReportSupplyProviderResponse> {
  if (!lineIdToken) {
    throw new Error('登入資訊有問題，請重新登入');
  }

  const base = isProd ? API_BASE_URL : `${window.location.origin}/api`; // dev should have /api for proxy
  const response = await fetch(`${base}/supply_providers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${lineIdToken}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('提交失敗,請稍後再試');
  }

  return response.json();
}
