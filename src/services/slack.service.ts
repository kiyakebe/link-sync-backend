import axios from "axios";
import { slackConfig } from "../config/slack";
import { logger } from "../utils/logger";

export class SlackService {
  static async notify(message: string): Promise<void> {
    try {
      await axios.post(slackConfig.webhookUrl, {
        text: message,
      });
      logger.info("Slack notification sent successfully");
    } catch (error: any) {
      logger.error("Failed to send Slack notification", {
        error: error.message,
      });
      throw new Error(`Failed to send Slack notification: ${error.message}`);
    }
  }
}
