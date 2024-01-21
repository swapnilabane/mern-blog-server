import cloudinary from 'cloudinary';
import multer from 'multer';

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

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleFileUpload = (req, res) => {
  try {
    const result = cloudinary.uploader.upload_stream(
      { folder: req.body.folder },
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Upload failed' });
        } else {
          console.log('Upload success:', result.secure_url);
          res.status(200).json({ url: result.secure_url });
        }
      }
    );

    req.file.stream.pipe(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

export { generateSignature, handleFileUpload };
