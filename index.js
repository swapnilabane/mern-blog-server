import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { authRoute } from './routes/authRoutes.js';
import { userRoute } from './routes/userRoutes.js';
import { postRoute } from './routes/postRoutes.js';
import { categoryRoute } from './routes/categoryRoutes.js';
import cloudinary from 'cloudinary';
import cors from 'cors';

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

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.post('/api/upload', async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const cloudinaryUrl = result.secure_url;
    res.status(200).json({ url: cloudinaryUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/categories', categoryRoute);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening for requests http://localhost:${port}`);
  });
});
