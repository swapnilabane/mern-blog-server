import express from 'express';
import {
  createPost,
  deletePost,
  getAllPost,
  getPost,
  updatePost,
} from '../controllers/postControllers.js';

const postRoute = express.Router();

postRoute.post('/create', createPost);
postRoute.put('/update/:id', updatePost);
postRoute.delete('/delete/:id', deletePost);
postRoute.get('/:id', getPost);
postRoute.get('/', getAllPost);
export { postRoute };
