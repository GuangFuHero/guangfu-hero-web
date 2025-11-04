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

export const formatTimeAgo = (timestamp: number): string => {
  if (!timestamp) return '時間未知';
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 0) return '剛剛';
  if (diff < 60) return '剛剛';
  if (diff < 3600) return `${Math.floor(diff / 60)}分鐘前`;

  const hours = Math.floor(diff / 3600);
  if (hours < 24) return `${hours}小時前`;

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days < 7) {
    return remainingHours === 0 ? `${days}天前` : `${days}天${remainingHours}小時前`;
  }

  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  if (weeks < 4) {
    return remainingDays === 0 ? `${weeks}週前` : `${weeks}週${remainingDays}天前`;
  }

  const months = Math.floor(days / 30);
  const remainingWeeks = Math.floor((days % 30) / 7);
  if (months < 12) {
    return remainingWeeks === 0 ? `${months}個月前` : `${months}個月${remainingWeeks}週前`;
  }

  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  return remainingMonths === 0 ? `${years}年前` : `${years}年${remainingMonths}個月前`;
};

export const mapLink = (address: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

export const phoneHref = (phone: string): string => {
  if (!phone) return '';
  const sanitized = `${phone}`.replace(/[^0-9+#*]/g, '');
  return `tel:${sanitized || phone}`;
};
