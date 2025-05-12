import { v2 as cloudinary } from "cloudinary";
import config from "../config/index.js";

export const sendImageToCloudinar = async (image_name, path) => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: image_name,
    })
    .catch((error) => {
      console.log(error);
    });

  return uploadResult;
};
