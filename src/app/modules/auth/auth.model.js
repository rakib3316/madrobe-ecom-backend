import bcrypt from "bcrypt";
import dayjs from "dayjs";
import mongoose from "mongoose";
import config from "../../../config/index.js";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
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

// Instance methods
userSchema.statics.isUserExist = async function (email) {
  const user = await UserModel.findOne({ email }).lean();

  return user;
};

userSchema.statics.isPasswordMatch = async function (
  givenPassword,
  savedPassword
) {
  const mathchPassword = await bcrypt.compare(givenPassword, savedPassword);

  return mathchPassword;
};

// যে মেথডগুলো সরাসরি মডেলের সাথে ব্যবহার করা হয় সেগুলো static method বলে। যেমন: pre().
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    parseInt(config.password_salt)
  );
  next();
});

export const UserModel =
  mongoose.models.userData ?? model("userData", userSchema, "userData");
