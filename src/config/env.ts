import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  // Server
  PORT: number;
  NODE_ENV: string;

  // LinkedIn
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_AD_ACCOUNT_URN: string;

  // Auth
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Slack
  SLACK_WEBHOOK_URL: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key] || defaultValue?.toString();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number for environment variable: ${key}`);
  }
  return parsed;
}

export const env: EnvConfig = {
  PORT: getEnvNumber("PORT", 8000),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  LINKEDIN_ACCESS_TOKEN: getEnvVar("LINKEDIN_ACCESS_TOKEN"),
  LINKEDIN_AD_ACCOUNT_URN: getEnvVar("LINKEDIN_AD_ACCOUNT_URN"),
  ADMIN_EMAIL: getEnvVar("ADMIN_EMAIL"),
  ADMIN_PASSWORD: getEnvVar("ADMIN_PASSWORD"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "24h"),
  SLACK_WEBHOOK_URL: getEnvVar("SLACK_WEBHOOK_URL"),
};
