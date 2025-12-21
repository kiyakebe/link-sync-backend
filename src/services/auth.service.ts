import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  email: string;
  iat?: number;
  exp?: number;
}

export class AuthService {
  static validate(email: string, password: string): boolean {
    return email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD;
  }

  static generateToken(email: string): string {
    const payload: Omit<TokenPayload, "iat" | "exp"> = {
      email,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as SignOptions);
  }

  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
