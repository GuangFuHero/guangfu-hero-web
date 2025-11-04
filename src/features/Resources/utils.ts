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
  // old API fields for compatibility
  recieved_count: 0,
  total_count: 0,
});

export const sanitizeItem = (item: SupplyItem): SupplyItem => ({
  id: item.id || '',
  supply_id: item.supply_id || '',
  tag: item.tag || '',
  name: item.name?.trim() ?? '',
  total_number: Number.isNaN(Number(item.total_number)) ? 0 : Number(item.total_number),
  unit: item.unit?.trim() ?? '',
  received_count: Number.isNaN(Number(item.received_count)) ? 0 : Number(item.received_count),
  // old API fields for compatibility
  recieved_count: Number.isNaN(Number(item?.recieved_count)) ? 0 : Number(item?.recieved_count),
  total_count: Number.isNaN(Number(item?.total_count)) ? 0 : Number(item?.total_count),
});
