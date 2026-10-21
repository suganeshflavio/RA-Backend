import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { sanitizeFileName } from "./b2";

interface CloudinaryUploadResult {
  publicId: string;
  url: string;
}

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string
): Promise<CloudinaryUploadResult> => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
        filename_override: sanitizeFileName(file.originalname),
      },
      (error, result?: UploadApiResponse) => {

        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });

      }
    );

    stream.end(file.buffer);

  });

};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {

  await cloudinary.uploader
    .destroy(publicId, { resource_type: "raw" })
    .catch((error) => {
      console.error(`Cloudinary delete failed for ${publicId}:`, error);
    });

};
