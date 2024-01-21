import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import { authRoute } from './routes/authRoutes.js';
import { userRoute } from './routes/userRoutes.js';
import { postRoute } from './routes/postRoutes.js';
import { categoryRoute } from './routes/categoryRoutes.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: 'https://creative-crisp-7add63.netlify.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, '/images')));

const port = process.env.PORT || '8000';
const mongoURL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded');
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/categories', categoryRoute);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`listening for requests http://localhost:${port}`);
  });
});
