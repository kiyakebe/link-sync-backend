import { app } from "./app";
import { startLinkedinAnalyticsJob } from "./jobs/linkedin-analytics.job";
import { env } from "./config/env";
import { logger } from "./utils/logger";

// Validate environment variables on startup
try {
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`, {
      environment: env.NODE_ENV,
    });
    startLinkedinAnalyticsJob();
  });
} catch (error: any) {
  logger.error("Failed to start server", { error: error.message });
  process.exit(1);
}
