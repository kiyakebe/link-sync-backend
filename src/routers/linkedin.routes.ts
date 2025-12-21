import { Router } from "express";
import { LinkedinController } from "../controllers/linkedin.controller";
import { adminAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/organizations",
  adminAuth,
  LinkedinController.fetchAdOrganizations
);

router.post("/notify-slack", adminAuth, LinkedinController.fetchAndNotifySlack);

export default router;
