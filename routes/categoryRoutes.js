import express from 'express';
import {
  createCategory,
  getCategory,
} from '../controllers/categoryController.js';

const categoryRoute = express.Router();

categoryRoute.post('/create', createCategory);
categoryRoute.get('/', getCategory);

export { categoryRoute };
