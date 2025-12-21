import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { logger } from "../utils/logger";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
      };
    }
  }
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(
      "Unauthorized access attempt - missing or invalid auth header",
      {
        path: req.path,
        ip: req.ip,
      }
    );
    return res.status(401).json({ message: "Unauthorized - Token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = AuthService.verifyToken(token);

    // Attach user info to request object
    req.user = {
      email: decoded.email,
    };

    next();
  } catch (error: any) {
    logger.warn("Unauthorized access attempt - invalid token", {
      path: req.path,
      ip: req.ip,
      error: error.message,
    });
    return res.status(401).json({
      message: "Unauthorized - Invalid or expired token",
    });
  }
};
