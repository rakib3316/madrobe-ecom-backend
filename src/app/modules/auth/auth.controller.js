import httpStatus from "http-status";
import config from "../../../config/index.js";
import catchAsync from "../../../utils/catchAsync.js";
import { sendMail } from "../../../utils/nodemailder.js";
import sendResponse from "../../../utils/sendResponse.js";
import { authServices } from "./auth.service.js";

const singupUser = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await authServices.singupUserToDB(user);

  const { password, ...others } = result;

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User singup successfully",
    data: others,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await authServices.loginUser(user);

  const { userDetails, token } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  };

  res.cookie("refreshToken", token.refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully",
    data: {
      userDetails,
      accessToken: token.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await authServices.refreshToken(refreshToken);

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New access token generated successfully!",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const body = req.body;

  const result = await authServices.forgotPassword(body);

  const link = `${req.protocol}://${req.get("host")}?token=${result}`;

  await sendMail("tdrl.dev3@gmail.com", link);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your email",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const body = req.body;
  const token = req.headers.authorization;

  await authServices.resetPassword(body, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your password reset successfully!",
  });
});

export const authControllers = {
  singupUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};
