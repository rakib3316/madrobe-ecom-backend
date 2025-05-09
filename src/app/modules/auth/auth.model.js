import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";
import config from "../../../config/index.js";

const userSchema = new Schema(
  {
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
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

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

export const UserModel = model("userData", userSchema, "userData");
