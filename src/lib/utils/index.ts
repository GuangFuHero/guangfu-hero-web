import { PlaceCoordinates, PlaceCoordinatesType } from '../types/place';

export function getAssetPath(path: string): string {
  return path;
}

export function getGoogleMapsUrl(coordinates: PlaceCoordinates): string | null {
  if (!coordinates?.coordinates) return null;

  switch (coordinates.type) {
    case PlaceCoordinatesType.POINT:
      const [lng, lat] = coordinates.coordinates;
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    case PlaceCoordinatesType.LINE_STRING:
      const coordsString = coordinates.coordinates
        .map(coord => `${coord[1]},${coord[0]}`)
        .join('|');
      return `https://www.google.com/maps/dir/?api=1&waypoints=${coordsString}&travelmode=walking`;

    default:
      return null;
  }
}
