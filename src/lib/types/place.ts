export enum PlaceCoordinatesType {
  POINT = 'Point',
  POLYGON = 'Polygon',
  LINE_STRING = 'LineString',
}

export type PointCoordinates = {
  type: PlaceCoordinatesType.POINT;
  coordinates: [number, number];
};

export type PolygonCoordinates = {
  type: PlaceCoordinatesType.POLYGON;
  coordinates: [number, number][];
};

export type LineStringCoordinates = {
  type: PlaceCoordinatesType.LINE_STRING;
  coordinates: [number, number][];
};

export type PlaceCoordinates = PointCoordinates | PolygonCoordinates | LineStringCoordinates | null;

export enum PlaceType {
  ACCOMMODATION = '住宿',
  MEDICAL_STATION = '醫療',
  RESTROOM = '廁所',
  SHOWER_STATION = '洗澡',
  WATER_STATION = '加水',
  SUPPLIES_STATION = '物資',
  REPAIR_STATION = '維修',
  FUEL_STATION = '加油',
  MENTAL_HEALTH_RESOURCE = '心理援助',
  SHELTER = '避難',
}

export const PLACE_TYPE_STRING_MAP: Record<PlaceType, string> = {
  [PlaceType.ACCOMMODATION]: '住宿點',
  [PlaceType.MEDICAL_STATION]: '醫療站',
  [PlaceType.RESTROOM]: '廁所',
  [PlaceType.SHOWER_STATION]: '洗澡點',
  [PlaceType.WATER_STATION]: '加水站',
  [PlaceType.SUPPLIES_STATION]: '物資站',
  [PlaceType.REPAIR_STATION]: '維修站',
  [PlaceType.FUEL_STATION]: '加油站',
  [PlaceType.SHELTER]: '避難處',
  [PlaceType.MENTAL_HEALTH_RESOURCE]: '心理資源',
};

type PlaceResource = {
  name: string;
  amount: number;
  unit: string;
};

type PlaceTag = {
  priority: number;
  name: string;
};

export interface Place {
  id: string;
  created_at: number;
  updated_at: number;
  name: string;
  address: string;
  address_description: string;
  coordinates: PlaceCoordinates;
  type: PlaceType;
  sub_type: string;
  info_sources: string[];
  verified_at: number;
  website_url: string;
  status: string;
  resources: PlaceResource[];
  open_date: string;
  end_date: string;
  open_time: string;
  end_time: string;
  contact_name: string;
  contact_phone: string;
  notes: string;
  tags: PlaceTag[];
}

export interface PlacesResponse {
  '@context': string;
  '@type': string;
  limit: number;
  member: Place[];
  next: string | null;
  offset: number;
  previous: string | null;
  totalItems: number;
}
