import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { categoryServices } from "./category.service.js";

const createCategory = catchAsync(async (req, res) => {
  const file = req.file;
  const payload = JSON.parse(req.body.data);

  const result = await categoryServices.createCategoryToDB(file, payload);

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
