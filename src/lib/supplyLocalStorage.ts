// Local storage key for supply provider reports
const STORAGE_KEY = "supply_provider_reports";

export interface ReportedSupplyItem {
  count: number;
  reportedAt: number; // timestamp
}

export type ReportedSupplies = Record<string, ReportedSupplyItem>;

/**
 * Get all reported supply items from local storage
 */
export function getReportedSupplies(): ReportedSupplies {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error reading from local storage:", error);
    return {};
  }
}

/**
 * Add a reported supply item to local storage
 */
export function addReportedSupply(
  supplyItemId: string,
  count: number
): void {
  if (typeof window === "undefined") return;

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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reported));
  } catch (error) {
    console.error("Error writing to local storage:", error);
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
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
}
