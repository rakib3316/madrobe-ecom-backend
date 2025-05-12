import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { blogServices } from "./blog.service.js";

const createBlog = catchAsync(async (req, res) => {
  const blog = req.body;

  const result = await blogServices.createBlogToDB(blog);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

const getBlogs = catchAsync(async (req, res) => {
  const result = await blogServices.getBlogsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Getting blogs successfully",
    data: result,
  });
});

export const blogControllers = { createBlog, getBlogs };
