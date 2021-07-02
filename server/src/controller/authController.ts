import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";

export interface IDecodedToken {
  id: string;
  name: string;
}

export const authController = (req: Request, res: Response, next: any) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      // 401 - Unauthorized
      return res.sendStatus(401).json("No authentication token, authorization failed");
    }

    // Verify the authentication token (check if expired, etc.)
    jwt.verify(token.replace("Bearer", "").trim(), process.env.KEYS, async (err, decodedToken: IDecodedToken) => {
        if (err) {
          return res.sendStatus(401).json("Invalid token");
        }
        req.user = await User.findById(decodedToken.id);
        next();
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
