import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { UserModel } from "./auth.model.js";
import ApiError from "../../../errors/ApiError.js";
import config from "../../../config/index.js";
import { jwtHelpers } from "../../../helpers/jwtHelpers.js";
import bcrypt from "bcrypt";

const singupUserToDB = async (user) => {
  const newUser = await UserModel.create(user);

  if (!newUser) {
    throw new ApiError("Failed to create user!");
  }

  return newUser;
};

const loginUser = async (payload) => {
  const { email, password } = payload;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required!");
  }

  if (!password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required!");
  }

  const isUserExist = await UserModel.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  const isPasswordMatch = await UserModel.isPasswordMatch(
    password,
    isUserExist?.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password don't match");
  }

  // Create accesstoken(for short time) & refreshtoken(for long time)
  const accessToken = jwtHelpers.createToken(
    { email: isUserExist.email },
    config.access_token_secret,
    config.access_token_expires_in
  );

  const refreshToken = jwtHelpers.createToken(
    { email: isUserExist?.email },
    config.refresh_token_secret,
    config.refresh_token_expires_in
  );

  return {
    userDetails: {
      fullName: isUserExist?.fullName,
      email: isUserExist?.email,
      role: isUserExist?.role,
      image: isUserExist?.image,
    },
    token: {
      accessToken,
      refreshToken,
    },
  };
};

const refreshToken = async (token) => {
  let verifyToken = null;

  try {
    verifyToken = jwtHelpers.verifyToken(token, config.refresh_token_secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }

  const { email } = verifyToken;

  // অনেক সময় দেখা যায় ইউজার ডাটাবেজ থেকে ডিলিট হয়ে গেছে, কিন্তু তার refresh token থেকে যায়। তাই আমাদের চেক করতে হবে যে, ইউজার ডাটাবেজে আছে কিনা। যদি না থাকে তাহলে আমরা নতুন accessToken তৈরি করবো না।
  const isUserExist = await UserModel.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  const newAccessToken = jwtHelpers.createToken(
    { email: isUserExist?.email },
    config.access_token_secret,
    config.access_token_expires_in
  );

  return {
    accessToken: newAccessToken,
  };
};

const forgotPassword = async (payload) => {
  const { email } = payload;

  const isUserExist = await UserModel.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const passwordResetToken = jwtHelpers.createPasswordResetToken(
    { email: isUserExist.email },
    config.reset_password_token_secret,
    config.reset_password_expires_in
  );

  return passwordResetToken;
};

const resetPassword = async (payload, token) => {
  const { email, newPassword } = payload;

  const isUserExist = await UserModel.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not found!");
  }

  const isVerified = jwtHelpers.verifyToken(
    token,
    config.reset_password_token_secret
  );

  if (isVerified) {
    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      parseInt(config.password_salt)
    );

    await UserModel.updateOne({ email }, { password: hashedNewPassword });
  }
};

export const authServices = {
  singupUserToDB,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};
