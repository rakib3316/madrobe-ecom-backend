import config from "../../config/index.js";
import ApiError from "../../errors/ApiError.js";
import handleCastError from "../../errors/handleCastError.js";
import handleDuplicationError from "../../errors/handleDuplicationError.js";
import handleJsonWebTokenError from "../../errors/handleJsonWebTokenError.js";
import handleJsonWebTokenExpiredError from "../../errors/handleJsonWebTokenExpiredError.js";
import handleValidationError from "../../errors/handleValidationError.js";

const globalErrorHandler = (err, req, res, next) => {
  config.env === "production" && console.log("global error >>", err);
  config.env === "development" && console.log("global error handler >>", err);

  let statusCode = 500,
    message = "Something went wrong!",
    errorMessages = [];

  if (err?.name === "ValidationError") {
    // Validaion error
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err?.name === "CastError") {
    // Cast error
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err?.code === 11000) {
    // Duplication error
    const simplifiedError = handleDuplicationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err?.name === "JsonWebTokenError") {
    // Json web token validation error
    const simplifiedError = handleJsonWebTokenError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err?.name === "TokenExpiredError") {
    const simplifiedError = handleJsonWebTokenExpiredError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof ApiError) {
    // Api error
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    // Default error instance
    message = err?.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    err,
    stack: config.env !== "production" ? err?.stack : null,
  });
};

export default globalErrorHandler;
