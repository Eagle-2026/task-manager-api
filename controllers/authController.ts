
import asyncHandler = require("express-async-handler");

import type { Request, Response } from "express";

import type { SignOptions } from "jsonwebtoken";

import jwt = require("jsonwebtoken");
import crypto = require("node:crypto");

import User = require("../models/userModel");

import Session = require("../models/sessionModel");

import AppError = require("../utils/appError");

import type { UserDocument } from "../types/user.types";

import type { SignupInput, LoginInput } from "../validators/authValidators";

// ========================================
// REQUEST TYPES
// ========================================

type SignupRequest = Request<{}, {}, SignupInput>;

type LoginRequest = Request<{}, {}, LoginInput>;

// ========================================
// ENVIRONMENT VARIABLE HELPER
// ========================================

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is missing`);
  }

  return value;
};

// ========================================
// HASH REFRESH TOKEN
// ========================================

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// ========================================
// CREATE ACCESS TOKEN
// ========================================

const signAccessToken = (id: UserDocument["_id"]): string => {
  const secret = getRequiredEnv("ACCESS_TOKEN_SECRET");

  const expiresIn = getRequiredEnv(
    "ACCESS_TOKEN_EXPIRES_IN",
  ) as SignOptions["expiresIn"];

  return jwt.sign(
    {
      id: id.toString(),
    },

    secret,

    {
      expiresIn,

      jwtid: crypto.randomUUID(),
    },
  );
};

// ========================================
// CREATE REFRESH TOKEN
// ========================================

const signRefreshToken = (id: UserDocument["_id"]): string => {
  const secret = getRequiredEnv("REFRESH_TOKEN_SECRET");

  const expiresIn = getRequiredEnv(
    "REFRESH_TOKEN_EXPIRES_IN",
  ) as SignOptions["expiresIn"];

  return jwt.sign(
    {
      id: id.toString(),
    },

    secret,

    {
      expiresIn,

      jwtid: crypto.randomUUID(),
    },
  );
};

// ========================================
// CREATE TOKENS + SESSION + COOKIES
// ========================================

const createSendToken = async (
  user: UserDocument,
  statusCode: number,
  res: Response,
): Promise<void> => {
  // 1. Create access token
  const accessToken = signAccessToken(user._id);

  // 2. Create refresh token
  const refreshToken = signRefreshToken(user._id);

  // 3. Hash refresh token
  const refreshTokenHash = hashToken(refreshToken);

  // 4. Create session
  await Session.create({
    user: user._id,

    refreshTokenHash,

    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

    revoked: false,
  });

  // 5. Access-token cookie
res.cookie("accessToken", accessToken, {
  maxAge: 15 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

  // 6. Refresh-token cookie
 res.cookie("refreshToken", refreshToken, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

  // 7. Remove password from response
  // without changing the Mongoose document.
  const userObject = user.toObject();

  const { password: _password, ...safeUser } = userObject;

  // 8. Response
  res.status(statusCode).json({
    status: "success",

    data: {
      user: safeUser,
    },
  });
};

// ========================================
// REFRESH ACCESS + REFRESH TOKENS
// ========================================

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  // 1. Read refresh token
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    res.status(401).json({
      status: "fail",
      message: "Refresh token not found",
    });

    return;
  }

  // 2. Get secret
  const refreshSecret = getRequiredEnv("REFRESH_TOKEN_SECRET");

  // 3. Verify JWT
  const decoded = jwt.verify(refreshToken, refreshSecret);

  // Type guard
  if (typeof decoded === "string" || typeof decoded.id !== "string") {
    throw new AppError("Invalid refresh token", 401);
  }

  // 4. Hash incoming token
  const refreshTokenHash = hashToken(refreshToken);

  // 5. Find session
  const session = await Session.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    res.status(401).json({
      status: "fail",
      message: "Invalid refresh session",
    });

    return;
  }

  // 6. Check expiration
  if (session.expiresAt < new Date()) {
    res.status(401).json({
      status: "fail",
      message: "Refresh session expired",
    });

    return;
  }

  // 7. Find user
  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(401).json({
      status: "fail",
      message: "User no longer exists",
    });

    return;
  }

  // 8. Session belongs to user?
  if (session.user.toString() !== user._id.toString()) {
    res.status(401).json({
      status: "fail",
      message: "Invalid refresh session",
    });

    return;
  }

  // 9. New access token
  const newAccessToken = signAccessToken(user._id);

  // 10. New refresh token
  const newRefreshToken = signRefreshToken(user._id);

  // 11. Hash new refresh token
  const newRefreshTokenHash = hashToken(newRefreshToken);

  // 12. Rotate session
  session.refreshTokenHash = newRefreshTokenHash;

  session.expiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000,
);

  await session.save();

  // 13. New access cookie
res.cookie("accessToken", newAccessToken, {
  maxAge: 15 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

  // 14. New refresh cookie
res.cookie("refreshToken", newRefreshToken, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

  // 15. Response
  res.status(200).json({
    status: "success",

    message: "Tokens refreshed successfully",
  });
});

// ========================================
// SIGNUP
// ========================================

export const signup = asyncHandler(
  async (req: SignupRequest, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({
        status: "fail",
        message: "An account with this email already exists",
      });

      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    await createSendToken(user, 201, res);
  },
);

// ========================================
// LOGIN
// ========================================

export const login = asyncHandler(async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });

    return;
  }

  await createSendToken(user, 200, res);
});

// ========================================
// LOGOUT
// ========================================

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (refreshToken) {
    const refreshTokenHash = hashToken(refreshToken);

    await Session.findOneAndUpdate(
      {
        refreshTokenHash,
      },
      {
        revoked: true,
      },
    );
  }

res.cookie("accessToken", "", {
  httpOnly: true,
  expires: new Date(0),
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

  res.cookie("refreshToken", "", {
  httpOnly: true,
  expires: new Date(0),
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

  res.status(200).json({
    status: "success",

    message: "Logged out successfully",
  });
});
