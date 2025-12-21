import { Request, Response, NextFunction } from "express";
import { LinkedinService } from "../services/linkedin.service";
import { OrganizationService } from "../services/organization.service";
import { SlackService } from "../services/slack.service";
import { extractOrganizationIds } from "../utils/linkedin.utils";
import { AppError } from "../middlewares/error.middleware";
import { logger } from "../utils/logger";
import axios from "axios";

export class LinkedinController {
  static async fetchAdOrganizations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // 1. Hardcoded Configuration
      const HARDCODED_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
      const url =
        "https://api.linkedin.com/rest/adAnalytics?q=analytics&accounts=List(urn%3Ali%3AsponsoredAccount%3A510645453)&pivot=MEMBER_COMPANY&timeGranularity=ALL&dateRange=(start:(year:2025,month:10,day:1),end:(year:2025,month:12,day:17))";

      // 2. Perform the HTTP Request
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${HARDCODED_TOKEN}`,
          "Linkedin-Version": "202511",
          "X-Restli-Protocol-Version": "2.0.0",
          Accept: "application/json",
        },
      });

      const analytics = response.data.elements || [];

      console.log(
        "LinkedIn Response Data:",
        JSON.stringify(analytics, null, 2)
      );

      if (!analytics.length) {
        return res.status(200).json({
          message: "No analytics data available",
          organizations: [],
        });
      }

      // 3. Extract IDs and Lookup Details
      const companyIds = extractOrganizationIds(analytics);

      if (!companyIds.length) {
        return res.status(200).json({
          message: "No organizations found in analytics pivot",
          organizations: [],
        });
      }

      const organizations = await OrganizationService.lookup(companyIds);

      return res.status(200).json({
        count: organizations.length,
        organizations,
      });
    } catch (error: any) {
      logger.error("Failed to fetch LinkedIn analytics", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message || "Failed to fetch LinkedIn analytics";

      next(new AppError(String(errorMessage), statusCode));
    }
  }

  static async fetchAndNotifySlack(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const analytics = await LinkedinService.getCompanyAnalytics();

      const companyIds = extractOrganizationIds(analytics);

      if (!companyIds.length) {
        return res.status(200).json({
          message: "No organizations to notify",
        });
      }

      const organizations = await OrganizationService.lookup(companyIds);

      const message = organizations.map((org) => `• ${org.name}`).join("\n");

      await SlackService.notify(
        `📊 LinkedIn Ad Engagement (Company Level)\n${message}`
      );

      return res.status(200).json({
        message: "Slack notification sent",
        count: organizations.length,
      });
    } catch (error: any) {
      logger.error("Failed to notify Slack", {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errorDetails ||
        error.response?.data ||
        error.message ||
        "Failed to notify Slack";

      next(new AppError(String(errorMessage), statusCode));
    }
  }
}
