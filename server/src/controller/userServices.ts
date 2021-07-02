import jwt from "jsonwebtoken";
import { IDecodedToken } from "./authController";
import {IRefreshToken} from "../models/refreshTokenModel";
import User from "../models/userModel";
import RefreshToken from "../models/refreshTokenModel";

async function getRefreshTokens(userId: string) {
    // check that user exists
    // Find user by email
    const user = await User.findOne({ userId });
    if (!user) {
      return ({ userNotFound: "User not found" });
    }
    // return refresh tokens for user
    const refreshTokens = await RefreshToken.find({ userId: userId });
    return refreshTokens;
}
/*
async function validateRefreshToken(token: string) {
  const refreshToken = await RefreshToken.findOne({ token }).populate('userId');
  const isExpired: boolean = Date.now() >= this.expires
    if (!refreshToken || !refreshToken.isActive) {
      return 'Invalid token';
    }
    return refreshToken;
}
*/
