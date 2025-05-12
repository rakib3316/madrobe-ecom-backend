import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { categoryServices } from "./category.service.js";

const createCategory = catchAsync(async (req, res) => {
  const payload = req.body;
  console.log("payload >>", payload);
  return false;
  const result = await categoryServices.createCategoryToDB(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

export const categoryControllers = {
  createCategory,
};
