import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import { authRoute } from './routes/authRoutes.js';
import { userRoute } from './routes/userRoutes.js';
import { postRoute } from './routes/postRoutes.js';
import { categoryRoute } from './routes/categoryRoutes.js';
import cloudinary from 'cloudinary';
import cors from 'cors';

import multer from 'multer';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://creative-crisp-7add63.netlify.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.use(express.json());

const port = process.env.PORT || '8000';
const mongoURL = process.env.MONGO_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.get('/api/sign', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );
  res.json({ signature, timestamp });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.buffer);
    const cloudinaryUrl = result.secure_url;
    res.status(200).json({ url: cloudinaryUrl });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    res.status(500).json({ error: 'Error uploading image to Cloudinary' });
  }
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/categories', categoryRoute);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(
      `Listening for requests https://mern-blog-server-hq7r.onrender.com`
    );
  });
});
