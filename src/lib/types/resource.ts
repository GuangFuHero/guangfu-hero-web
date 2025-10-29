import { SupplyItem } from '.';

export interface SupplyProvider {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  supply_item_id: string;
  provide_count: number | null;
  provide_unit: string;
  created_at: number;
  updated_at: number;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  phone: string;
  notes?: string;
  supplies: SupplyItem[];
}

export interface CreateFormData {
  org: string;
  phone: string;
  address: string;
  items: SupplyItem[];
}
export interface DeliveryData extends Omit<CreateFormData, 'items'> {
  items: (SupplyItem & { count: number })[];
}

export const TYPE_MAP = {
  '食物/水': { label: '飲食', order: 0, color: '#00A9F1' },
  醫療用品: { label: '醫療用品', order: 1, color: '#FF981F' },
  生活用品: { label: '生活用品', order: 2, color: '#8BC255' },
  大型機具: { label: '大型機具', order: 3, color: '#7A5548' },
  動物醫療: { label: '動物醫療', order: 4, color: '#FFC02D' },
  水電: { label: '水電', order: 5, color: '#3F51B2' },
  其他: { label: '其他', order: 6, color: '#607D8A' },
} as const;

export const typeOptions = Object.keys(TYPE_MAP).map(value => ({
  value,
  label: TYPE_MAP[value as keyof typeof TYPE_MAP].label,
}));

export type SupplyType = keyof typeof TYPE_MAP;

export interface TypeMeta {
  label: string;
  order: number;
  color: string;
}

export interface RequestStatus {
  label: string;
  type: 'success' | 'danger' | 'warning';
}
