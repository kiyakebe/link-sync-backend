import { linkedinClient } from "../utils/linkedin-client";
import { linkedinConfig } from "../config/linkedin";
import {
  LinkedInAnalyticsResponse,
  LinkedInAnalyticsElement,
} from "../types/linkedin.types";
import { formatDateRange } from "../utils/linkedin.utils";
import { logger } from "../utils/logger";

interface GetCompanyAnalyticsOptions {
  startDate?: Date;
  endDate?: Date;
}

export class LinkedinService {
  static async getCompanyAnalytics(
    options: GetCompanyAnalyticsOptions = {}
  ): Promise<LinkedInAnalyticsElement[]> {
    const { startDate, endDate } = options;

    // Default to last 30 days if not provided
    const end = endDate || new Date();
    const start = startDate || new Date(Date.now() - 120 * 24 * 60 * 60 * 1000);

    const dateRange = formatDateRange(start, end);
    // Format: List(urn:li:sponsoredAccount:XXXXX) - adAccountUrn should be just the URN
    const accounts = `List(${linkedinConfig.adAccountUrn})`;

    // Build query string manually to match REST.li format exactly
    // REST.li requires specific encoding - encode each parameter value separately
    const queryParams = new URLSearchParams();
    queryParams.append("q", "analytics");
    queryParams.append("accounts", accounts); // Will encode List(urn:li:...) properly
    queryParams.append("pivot", "MEMBER_COMPANY");
    queryParams.append("timeGranularity", "ALL");
    queryParams.append("dateRange", dateRange); // Will encode the parentheses

    const queryString = queryParams.toString();

    logger.debug("Fetching LinkedIn analytics", {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      dateRange,
      adAccountUrn: linkedinConfig.adAccountUrn,
      accounts,
      queryString,
    });

    try {
      // Append query string directly to URL instead of using params object
      const response = await linkedinClient.get<LinkedInAnalyticsResponse>(
        `/adAnalytics?${queryString}`
      );

      return response.data.elements || [];
    } catch (error: any) {
      // Extract detailed error information
      const errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        queryString,
        accounts,
        dateRange,
      };

      logger.error("LinkedIn API error", errorDetails);

      // Create a more descriptive error with LinkedIn's actual error message
      if (error.response?.data) {
        const linkedinError = new Error(
          `LinkedIn API Error (${error.response.status}): ${JSON.stringify(
            error.response.data
          )}`
        );
        (linkedinError as any).response = error.response;
        throw linkedinError;
      }

      throw error;
    }
  }
}
