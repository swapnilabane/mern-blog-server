import { postModel } from '../models/categoryModel.js';

const createCategory = async (req, res) => {
  try {
    const newCat = await postModel.create(req.body);
    res.json(newCat);
  } catch (error) {
    throw new Error(error);
  }
};

const getCategory = async (req, res) => {
  try {
    const newCat = await postModel.find();
    res.json(newCat);
  } catch (error) {
    throw new Error(error);
  }
};

export { createCategory, getCategory };
