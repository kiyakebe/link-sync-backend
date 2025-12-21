import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const isValid = AuthService.validate(email, password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = AuthService.generateToken(email);

    return res.status(200).json({
      message: "Login successful",
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
  }
}
