import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError.js";
import { BlogModel } from "./blog.model.js";
import { getFilterQuery } from "./blog.utils.js";

const createBlogToDB = async (payload) => {
  const blog = await BlogModel.create(payload);

  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create blog!");
  }

  return blog;
};

const getBlogsFromDB = async (query) => {
  let filterQuery = { ...query };

  const searchTerm = query?.searchTerm || "";
  const sort = query?.sort || "-date";
  const limit = Number(query?.limit) || 10;
  const page = Number(query?.page) || 1;
  const skip = (page - 1) * limit;

  const searchFields = ["title", "content"];
  const excluseFields = ["searchTerm", "sort", "limit", "page"];
  excluseFields.forEach((ele) => delete filterQuery[ele]);

  let modifiedFilterQuery = {};

  Object.keys(filterQuery).forEach((item) => {
    modifiedFilterQuery[item] = {
      $in: filterQuery[item].split(",").map((name) => name.trim()),
    };

    if (
      filterQuery[item] === "true" ||
      filterQuery[item] === "false" ||
      filterQuery[item] === "true,false" ||
      filterQuery[item] === "false,true"
    ) {
      modifiedFilterQuery[item] = {
        $in: filterQuery[item]
          .split(",")
          .map((name) => name.trim())
          .map((item) => JSON.parse(item)),
      };
    }
  });

  const finalQuery = {
    $or: searchFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
    ...modifiedFilterQuery,
  };

  const totalBlogs = await BlogModel.countDocuments(finalQuery);
  const blogs = await BlogModel.find(finalQuery)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  if (!blogs) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to get blogs.");
  }

  return {
    meta: {
      total: totalBlogs,
      page,
      limit,
    },
    result: blogs,
  };
};

export const blogServices = { createBlogToDB, getBlogsFromDB };
