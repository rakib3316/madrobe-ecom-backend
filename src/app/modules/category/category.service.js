import dayjs from "dayjs";
import mongoose from "mongoose";
import { sendImageToCloudinar } from "../../../utils/sendImageToCloudinary.js";
import { CategoryModel } from "./category.model.js";

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

export const categoryServices = { createCategoryToDB };
