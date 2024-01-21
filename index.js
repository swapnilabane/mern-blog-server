import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import { authRoute } from './routes/authRoutes.js';
import { userRoute } from './routes/userRoutes.js';
import { postRoute } from './routes/postRoutes.js';
import { categoryRoute } from './routes/categoryRoutes.js';
import cors from 'cors';
import { signatureRouter } from './routes/signatureRoutes.js';
import { fileRouter } from './routes/fileRoutes.js';

const app = express();
const port = process.env.PORT || 8000;
const mongoURL = process.env.MONGO_URL;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://golden-pastelito-390045.netlify.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/sign-upload', signatureRouter);
app.use('/api/file', fileRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(
      `Listening for requests at https://mern-blog-server-hq7r.onrender.com`
    );
  });
});
