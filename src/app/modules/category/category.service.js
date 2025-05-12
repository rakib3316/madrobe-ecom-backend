import { CategoryModel } from "./category.model.js";

const createCategoryToDB = async (category) => {
  const newCategory = await CategoryModel.create(category);

  if (!newCategory) {
    throw new ApiError("❌ Failed to create new category!");
  }

  return newCategory;
};

export const categoryServices = { createCategoryToDB };
