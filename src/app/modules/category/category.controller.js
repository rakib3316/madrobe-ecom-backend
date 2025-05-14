import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { CategoryServices } from "./category.service.js";

const getCategories = catchAsync(async (req, res) => {
  const query = req.body;

  const result = await CategoryServices.getCategoriesFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Getting categories successfully!",
    data: result,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const file = req.file;
  const payload = JSON.parse(req.body.data);
  console.log("user >>", req?.user);
  const result = await CategoryServices.createCategoryToDB(file, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

export const CategoryControllers = {
  getCategories,
  createCategory,
};
