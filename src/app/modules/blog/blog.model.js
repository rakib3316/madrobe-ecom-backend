import { Schema, model } from "mongoose";

const blogSchema = new Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  author: {
    type: String
  },
  date: {
    type: String
  },
  content: {
    type: String
  },
  tages: [String],
  coverImage: {
    type: String
  }
});

export const BlogModel = model("dummyBlogData", blogSchema, "dummyBlogData");
