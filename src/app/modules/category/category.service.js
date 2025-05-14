import dayjs from "dayjs";
import mongoose from "mongoose";
import { sendImageToCloudinar } from "../../../utils/sendImageToCloudinary.js";
import { CategoryModel } from "./category.model.js";

const getCategoriesFromDB = async (query) => {
  let filterQuery = { ...query };

  const searchTerm = query?.searchTerm || "";
  const sort = query?.sort || "-posted_date";
  const limit = Number(query?.limit) || 10;
  const page = Number(query?.page) || 1;
  const skip = (page - 1) * limit;

  const searchFields = ["category_name"];
  const excluseFields = ["searchTerm", "sort", "limit", "page"];
  excluseFields.forEach((ele) => delete filterQuery[ele]);

  let modifiedFilterQuery = {};

  Object.keys(filterQuery).forEach((item) => {
    modifiedFilterQuery[item] = {
      $in: filterQuery[item].split(",").map((field) => field.trim()),
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
          .map((field) => field.trim())
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

  const totalCategories = await CategoryModel.countDocuments(finalQuery);
  const categories = await CategoryModel.find(finalQuery)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  if (!categories) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to get categories.");
  }

  return {
    meta: {
      total: totalCategories,
      page,
      limit,
    },
    data: categories,
  };
};

const createCategoryToDB = async (file, category) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      let fileName = file.originalname.split(".")[0];
      let today = dayjs(new Date()).format("DD_MM_YYYY");
      let image_name = `${fileName}_${today}`;

      let cloudinaryResult = await sendImageToCloudinar(image_name, file.path);

      let imagePayload = {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
        upload_date: cloudinaryResult.created_at,
        source: "cloudinary",
      };

      category.image = imagePayload;
    }

    const newCategory = await CategoryModel.create(category);

    await session.commitTransaction();
    await session.endSession();

    return newCategory;
  } catch (err) {
    console.log("⛔ category/create error >>", err);
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const CategoryServices = { getCategoriesFromDB, createCategoryToDB };
