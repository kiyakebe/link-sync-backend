import { LinkedInAnalyticsElement } from "../types/linkedin.types";

/**
 * Extracts organization IDs from LinkedIn analytics pivot values
 * @param analytics - Array of LinkedIn analytics elements
 * @returns Array of organization IDs (numbers)
 */
export function extractOrganizationIds(
  analytics: LinkedInAnalyticsElement[]
): number[] {
  return analytics
    .flatMap((a) => a.pivotValues || [])
    .map((v: string) => {
      const match = v.match(/urn:li:organization:(\d+)/);
      return match ? Number(match[1]) : null;
    })
    .filter((id): id is number => id !== null && !isNaN(id));
}

/**
 * Formats date range for LinkedIn API
 * @param start - Start date
 * @param end - End date
 * @returns Formatted date range string
 */
export function formatDateRange(start: Date, end: Date): string {
  const startDate = {
    year: start.getFullYear(),
    month: start.getMonth() + 1,
    day: start.getDate(),
  };
  const endDate = {
    year: end.getFullYear(),
    month: end.getMonth() + 1,
    day: end.getDate(),
  };

  return `(start:(year:${startDate.year},month:${startDate.month},day:${startDate.day}),end:(year:${endDate.year},month:${endDate.month},day:${endDate.day}))`;
}
