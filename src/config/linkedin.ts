import { env } from "./env";

export const linkedinConfig = {
  accessToken: env.LINKEDIN_ACCESS_TOKEN,
  adAccountUrn: env.LINKEDIN_AD_ACCOUNT_URN,
  apiVersion: "202511",
  baseURL: "https://api.linkedin.com/rest",
} as const;
