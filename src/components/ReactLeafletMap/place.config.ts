import { PLACE_TYPE_STRING_MAP, PlaceType } from '@/types/place';

type PlaceConfig = {
  type: PlaceType;
  label: string;
  icon: string;
  color: string;
};

export const PLACE_CONFIG: Array<PlaceConfig> = [
  {
    type: PlaceType.ACCOMMODATION,
    label: PLACE_TYPE_STRING_MAP[PlaceType.ACCOMMODATION],
    icon: '🏠',
    color: '#6b7280',
  },
  {
    type: PlaceType.WATER_STATION,
    label: PLACE_TYPE_STRING_MAP[PlaceType.WATER_STATION],
    icon: '💧',
    color: '#06b6d4',
  },
  {
    type: PlaceType.RESTROOM,
    label: PLACE_TYPE_STRING_MAP[PlaceType.RESTROOM],
    icon: '🚻',
    color: '#8b5cf6',
  },
  {
    type: PlaceType.SHOWER_STATION,
    label: PLACE_TYPE_STRING_MAP[PlaceType.SHOWER_STATION],
    icon: '🚿',
    color: '#f59e0b',
  },
  {
    type: PlaceType.MEDICAL_STATION,
    label: PLACE_TYPE_STRING_MAP[PlaceType.MEDICAL_STATION],
    icon: '🏥',
    color: '#dc2626',
  },
  {
    type: PlaceType.SUPPLIES_STATION,
    label: PLACE_TYPE_STRING_MAP[PlaceType.SUPPLIES_STATION],
    icon: '📦',
    color: '#10b981',
  },
  {
    type: PlaceType.SHELTER,
    label: PLACE_TYPE_STRING_MAP[PlaceType.SHELTER],
    icon: '⛺',
    color: '#f97316',
  },
  {
    type: PlaceType.PSYCHOLOGICAL_AID,
    label: PLACE_TYPE_STRING_MAP[PlaceType.PSYCHOLOGICAL_AID],
    icon: '❤️',
    color: '#92400e',
  },
];
