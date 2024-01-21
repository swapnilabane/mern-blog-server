import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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

export { handleFileUpload };
