import dayjs from 'dayjs';
import { Place, PlaceCoordinates, PlaceCoordinatesType } from '../types/place';

export function getAssetPath(path: string): string {
  return path;
}

export function getGoogleMapsUrl(coordinates: PlaceCoordinates): string | null {
  if (!coordinates) return null;

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

export const formatDateRange = (
  openDate?: Place['open_date'],
  endDate?: Place['end_date']
): string | null => {
  const validOpenDate = openDate && dayjs(openDate).isValid();
  const validEndDate = endDate && dayjs(endDate).isValid();

  if (!validOpenDate && !validEndDate) {
    return null;
  }

  let result = '';

  if (validOpenDate) {
    result += dayjs(openDate).format('YYYY/MM/DD');
  }

  result += ' ~';

  if (validEndDate) {
    result += ` ${dayjs(endDate).format('YYYY/MM/DD')}`;
  }

  return result;
};

export const formatTimeRange = (
  openTime?: Place['open_time'],
  endTime?: Place['end_time']
): string | null => {
  const validOpenTime = openTime && dayjs(openTime).isValid();
  const validEndTime = endTime && dayjs(endTime).isValid();

  if (!validOpenTime && !validEndTime) {
    return null;
  }

  let result = '';

  if (validOpenTime) {
    result += dayjs(openTime).format('HH:mm');
  }

  result += ' ~';

  if (validEndTime) {
    result += ` ${dayjs(endTime).format('HH:mm')}`;
  }

  return result;
};

export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number = 400,
  options: { leading?: boolean; trailing?: boolean } = {
    leading: true,
    trailing: true,
  }
) {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: unknown[];
  let lastThis: ThisParameterType<T>;

  const { leading = true, trailing = false } = options;

  return function (this: ThisParameterType<T>, ...args: unknown[]) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      if (leading) func.apply(lastThis, lastArgs);
    } else if (trailing && !timeout) {
      timeout = setTimeout(() => {
        lastCall = leading ? Date.now() : 0;
        timeout = null;
        func.apply(lastThis, lastArgs);
      }, remaining);
    }
  };
}
