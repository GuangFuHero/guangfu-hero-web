import { getEditApiUrl } from '@/lib/api';
import { CreateFormData } from '@/lib/types/resource';
import { transformToApiData } from './utils';

export async function createSupplyRequest(payload: CreateFormData): Promise<void> {
  const firstItemData = transformToApiData({ ...payload, items: [payload.items[0]] });

  const firstResponse = await fetch(`${getEditApiUrl()}/supplies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(firstItemData),
  });

  if (!firstResponse.ok) {
    const errorText = await firstResponse.text();
    throw new Error(`第 1 個物資新增失敗: HTTP ${firstResponse.status} - ${errorText}`);
  }

  const firstResponseData = await firstResponse.json();
  const supplyId = firstResponseData.id;
  const valid_pin = firstResponseData.valid_pin;

  if (!supplyId || !valid_pin) {
    throw new Error('無法取得物資 ID 或有效 PIN');
  }

  if (payload.items.length > 1) {
    const remainingItems = payload.items.slice(1);
    const promises = remainingItems.map(item => {
      const supplyItemData = {
        supply_id: supplyId,
        tag: item.tag,
        name: item.name,
        total_number: item.total_number,
        unit: item.unit,
        valid_pin,
      };
      return fetch(`${getEditApiUrl()}/supply_items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplyItemData),
      });
    });

    const responses = await Promise.all(promises);
    for (let i = 0; i < responses.length; i += 1) {
      const response = responses[i];
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`第 ${i + 2} 個物資新增失敗: HTTP ${response.status} - ${errorText}`);
      }
    }
  }
}

export async function updateDeliveryProgress(
  id: string,
  deliveryData: Array<{ id: string; count: number }>
): Promise<void> {
  const response = await fetch(`${getEditApiUrl()}/supplies/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deliveryData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`配送失敗: HTTP ${response.status} - ${errorText}`);
  }
}
