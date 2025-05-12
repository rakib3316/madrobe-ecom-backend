import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config/index.js";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinar = async (image_name, path) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: image_name,
    })
    .catch((error) => {
      console.log(error);
    });

  // Delete a file asynchronously
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`${image_name} => file deleted successfully 👍`);
    }
  });

  return uploadResult;
};
