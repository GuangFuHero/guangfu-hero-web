import { Supply, SupplyItem } from '@/lib/types';
import { CreateFormData, SupplyType, TYPE_MAP, TypeMeta } from '@/lib/types/resource';

export const typeMeta = (type: string): TypeMeta => {
  return TYPE_MAP[type as SupplyType] ?? TYPE_MAP['其他'];
};

export const remainingNeed = (item: Supply['supplies'][number]): number => {
  return Math.max(0, (item.total_number ?? 0) - (item.received_count ?? 0));
};

export const isCompleted = (req: Supply): boolean => {
  return req.supplies.every(item => (item.received_count ?? 0) >= (item.total_number ?? 0));
};

export const decorateRequestItems = (req: Supply) => {
  return req.supplies.map((item, index) => ({
    item,
    index,
    remaining: remainingNeed(item),
  }));
};

export const pendingItems = (req: Supply) => {
  return decorateRequestItems(req).filter(({ remaining }) => remaining > 0);
};

export const fulfilledItems = (req: Supply) => {
  return decorateRequestItems(req).filter(({ remaining }) => remaining === 0);
};

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

export const displayPhone = (req: Supply) => {
  if (isCompleted(req)) return false;
  return !!req.phone;
};

export const transformToApiData = (frontendData: CreateFormData) => {
  if (frontendData.items.length === 0) {
    throw new Error('至少需要一個物資項目');
  }
  return {
    name: frontendData.org,
    address: frontendData.address,
    phone: frontendData.phone,
    supplies: {
      tag: frontendData.items[0].tag,
      name: frontendData.items[0].name,
      received_count: frontendData.items[0].received_count,
      total_number: frontendData.items[0].total_number,
      unit: frontendData.items[0].unit,
    },
  };
};

export const mergeRequestsByOrganization = (list: Supply[]): Supply[] => {
  const mergedMap = new Map();
  list.forEach(req => {
    const key = `${req.name}|${req.address}|${req.phone}`;
    const itemsWithSupplyId = req.supplies.map(item => ({
      ...item,
      supplyId: req.id,
    }));

    if (mergedMap.has(key)) {
      const existing = mergedMap.get(key);
      existing.items.push(...itemsWithSupplyId);
      if (req.created_at > existing.created_at) {
        existing.created_at = req.created_at;
      }
    } else {
      mergedMap.set(key, {
        ...req,
        items: itemsWithSupplyId,
      });
    }
  });
  return Array.from(mergedMap.values());
};

export const makeEmptyItem = (): SupplyItem => ({
  id: '',
  supply_id: '',
  tag: '食物/水',
  name: '',
  total_number: 1,
  unit: '',
  received_count: 0,
});

export const sanitizeItem = (item: SupplyItem): SupplyItem => ({
  id: item.id || '',
  supply_id: item.supply_id || '',
  tag: item.tag || '',
  name: item.name?.trim() ?? '',
  total_number: Number.isNaN(Number(item.total_number)) ? 0 : Number(item.total_number),
  unit: item.unit?.trim() ?? '',
  received_count: Number.isNaN(Number(item.received_count)) ? 0 : Number(item.received_count),
});
