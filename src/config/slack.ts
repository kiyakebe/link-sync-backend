import { env } from "./env";

export const slackConfig = {
  webhookUrl: env.SLACK_WEBHOOK_URL,
} as const;
