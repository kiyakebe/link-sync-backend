import { Router } from "express";
import { LinkedinController } from "../controllers/linkedin.controller";
import { adminAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/linkedin/organizations:
 *   get:
 *     summary: Fetch LinkedIn ad organizations
 *     description: Retrieves organizations that have engaged with LinkedIn ads based on analytics data
 *     tags: [LinkedIn]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved organizations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrganizationsResponse'
 *             examples:
 *               success:
 *                 value:
 *                   count: 2
 *                   organizations:
 *                     - id: 12345
 *                       name: "Example Company 1"
 *                     - id: 67890
 *                       name: "Example Company 2"
 *               empty:
 *                 value:
 *                   message: "No analytics data available"
 *                   organizations: []
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/organizations",
  adminAuth,
  LinkedinController.fetchAdOrganizations
);

/**
 * @swagger
 * /api/linkedin/notify-slack:
 *   post:
 *     summary: Fetch LinkedIn organizations and notify Slack
 *     description: Retrieves LinkedIn ad organizations and sends a formatted notification to Slack
 *     tags: [LinkedIn]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Slack notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlackNotificationResponse'
 *             example:
 *               message: "Slack notification sent"
 *               count: 3
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/notify-slack", adminAuth, LinkedinController.fetchAndNotifySlack);

export default router;
