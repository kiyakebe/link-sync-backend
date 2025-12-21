import cron from "node-cron";
import { LinkedinService } from "../services/linkedin.service";
import { OrganizationService } from "../services/organization.service";
import { SlackService } from "../services/slack.service";
import { extractOrganizationIds } from "../utils/linkedin.utils";
import { logger } from "../utils/logger";

export const startLinkedinAnalyticsJob = () => {
  logger.info("Starting LinkedIn analytics job (runs every 6 hours)");

  cron.schedule("0 */6 * * *", async () => {
    try {
      logger.info("Running LinkedIn analytics job");
      const analytics = await LinkedinService.getCompanyAnalytics();

      const companyIds = extractOrganizationIds(analytics);

      if (!companyIds.length) {
        logger.info("No organizations found in analytics");
        return;
      }

      const organizations = await OrganizationService.lookup(companyIds);

      const message = organizations.map((org) => `• ${org.name}`).join("\n");

      await SlackService.notify(
        `📊 Organizations interacting with your LinkedIn Ad:\n${message}`
      );

      logger.info(
        `Successfully notified Slack about ${organizations.length} organizations`
      );
    } catch (error: any) {
      logger.error("Error in LinkedIn analytics job", { error });
    }
  });
};
