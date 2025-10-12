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

export type PlaceCoordinates = PointCoordinates | PolygonCoordinates | LineStringCoordinates;

export enum PlaceType {
  WATER_STATION = '加水',
  RESTROOM = '廁所',
  SHOWER_STATION = '洗澡',
  MEDICAL_STATION = '醫療',
  ACCOMMODATION = '住宿',
  SHELTER = '避難',
  SUPPLIES_STATION = '物資',
  PSYCHOLOGICAL_AID = '心理援助',
}

export const PLACE_TYPE_STRING_MAP: Record<PlaceType, string> = {
  [PlaceType.SHELTER]: '庇護所',
  [PlaceType.WATER_STATION]: '加水站',
  [PlaceType.SHOWER_STATION]: '洗澡點',
  [PlaceType.MEDICAL_STATION]: '醫療站',
  [PlaceType.ACCOMMODATION]: '住宿',
  [PlaceType.SUPPLIES_STATION]: '物資站',
  [PlaceType.RESTROOM]: '廁所',
  [PlaceType.PSYCHOLOGICAL_AID]: '心理援助',
};

type PlaceResource = {
  name: string;
  count: number;
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
