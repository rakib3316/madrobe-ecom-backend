import dayjs from "dayjs";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  category_name: {
    type: String,
    required: true,
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  image: {
    url: { type: String, default: null },
    public_id: { type: String, default: null },
    source: { type: String, enum: ["cloudinary", "aws"] },
    upload_date: { type: Date, default: null },
  },
  children: {
    type: [Schema.Types.ObjectId],
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  posted_by: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "userData",
  },
  posted_user: {
    type: String,
    required: true,
  },
  posted_date: {
    type: Date,
    required: true,
    default: dayjs().toString(),
  },
  modified_by: {
    type: Schema.Types.ObjectId,
    ref: "userData",
    default: null,
  },
  modified_user: {
    type: String,
    default: null,
  },
  modified_date: {
    type: Date,
    default: null,
  },
});

export const CategoryModel =
  mongoose.models.categoryData ??
  model("categoryData", categorySchema, "categoryData");
