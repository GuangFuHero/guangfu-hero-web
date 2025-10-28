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
  '食物/水': { label: '飲食', order: 0, color: '#14b8a6' },
  醫療用品: { label: '醫療用品', order: 1, color: '#f59e0b' },
  生活用品: { label: '生活用品', order: 2, color: '#22c55e' },
  大型機具: { label: '大型機具', order: 3, color: '#3b82f6' },
  動物醫療: { label: '動物醫療', order: 4, color: '#934f36' },
  水電: { label: '水電', order: 5, color: '#8b5cf6' },
  其他: { label: '其他', order: 6, color: '#a855f7' },
};

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
