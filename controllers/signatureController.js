import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const generateSignature = (req, res, next) => {
  const { folder } = req.body;

  if (!folder) {
    res.status(400);
    return next(new Error('folder name is required'));
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Determine the upload preset based on the folder
    const uploadPreset =
      folder === 'images'
        ? process.env.CLOUDINARY_IMAGES_UPLOAD_PRESET
        : folder === 'videos'
        ? process.env.CLOUDINARY_VIDEOS_UPLOAD_PRESET
        : null;

    if (!uploadPreset) {
      res.status(400);
      return next(new Error('Invalid folder specified'));
    }

    // Include the upload preset in the parameters
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        upload_preset: uploadPreset,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(error);
  }
};

export { generateSignature };
