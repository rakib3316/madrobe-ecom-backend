import httpStatus from "http-status";
import config from "../../config/index.js";
import ApiError from "../../errors/ApiError.js";
import { jwtHelpers } from "../../helpers/jwtHelpers.js";
import catchAsync from "../../utils/catchAsync.js";

const auth = () => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Your are not authrized user."
      );
    }

    let verifiedUser = null;

    verifiedUser = jwtHelpers.verifyToken(token, config.access_token_secret);
    // console.log("veri user >>", verifiedUser);

    req.user = verifiedUser;
    next();
  });
};

export default auth;
