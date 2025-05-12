import mongoose from "mongoose";
import { sendImageToCloudinar } from "../../../utils/sendImageToCloudinary.js";
import { CategoryModel } from "./category.model.js";

const createCategoryToDB = async (file, category) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      let image_name = "madrobe_ecom";
      let cloudinaryResult = await sendImageToCloudinar(image_name, file.path);

      category.image = cloudinaryResult.secure_url;
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

export const categoryServices = { createCategoryToDB };
