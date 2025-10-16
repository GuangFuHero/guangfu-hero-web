import { PlaceType } from './place';

export type PlaceTab = 'all' | PlaceType;

export interface UserPosition {
  lat: number;
  lng: number;
}
