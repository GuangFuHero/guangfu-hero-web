// Local storage key for supply provider info
const STORAGE_KEY_PROVIDER_INFO = 'supply_provider_info';
// Local storage key for supply provider reports
const STORAGE_KEY_REPORTS = 'supply_provider_reports';

export interface ProviderInfo {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export interface ReportedSupplyItem {
  count: number;
  reportedAt: number; // timestamp
}

export type ReportedSupplies = Record<string, ReportedSupplyItem>;

/**
 * Get the stored provider info from local storage
 */
export function getStoredProviderInfo(): ProviderInfo {
  if (typeof window === 'undefined') return <ProviderInfo>{};

  try {
    const stored = localStorage.getItem(STORAGE_KEY_PROVIDER_INFO);
    return stored ? JSON.parse(stored) : <ProviderInfo>{};
  } catch (error) {
    console.error('Error reading from local storage:', error);
    return <ProviderInfo>{};
  }
}

/**
 * Save the provider info to local storage
 */
export function updateStoredProvderInfo(
  name: string,
  phone: string,
  address: string,
  notes?: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const newProviderInfo: ProviderInfo = {
      name: name,
      phone: phone,
      address: address,
      notes: notes ?? '',
    };

    localStorage.setItem(STORAGE_KEY_PROVIDER_INFO, JSON.stringify(newProviderInfo));
  } catch (error) {
    console.error('Error writing to local storage:', error);
  }
}

/**
 * Get all reported supply items from local storage
 */
export function getReportedSupplies(): ReportedSupplies {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading from local storage:', error);
    return {};
  }
}

/**
 * Add a reported supply item to local storage
 */
export function addReportedSupply(supplyItemId: string, count: number): void {
  if (typeof window === 'undefined') return;

  try {
    const reported = getReportedSupplies();

    // If item already exists, add to the count
    if (reported[supplyItemId]) {
      reported[supplyItemId].count += count;
      reported[supplyItemId].reportedAt = Date.now();
    } else {
      reported[supplyItemId] = {
        count,
        reportedAt: Date.now(),
      };
    }

    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reported));
  } catch (error) {
    console.error('Error writing to local storage:', error);
  }
}

/**
 * Check if a supply item has been reported
 */
export function isSupplyReported(supplyItemId: string): boolean {
  const reported = getReportedSupplies();
  return !!reported[supplyItemId];
}

/**
 * Get the reported count for a specific supply item
 */
export function getReportedCount(supplyItemId: string): number {
  const reported = getReportedSupplies();
  return reported[supplyItemId]?.count || 0;
}

/**
 * Clear all reported supplies (for testing or reset)
 */
export function clearReportedSupplies(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY_REPORTS);
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
}
