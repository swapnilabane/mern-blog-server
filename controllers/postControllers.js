import { userModel } from '../models/userModel.js';
import { postModel } from '../models/postModel.js';
import axios from 'axios';

import { userModel } from '../models/userModel.js';
import { postModel } from '../models/postModel.js';
import axios from 'axios';

const createPost = async (req, res) => {
  try {
    const signResponse = await axios.get(
      'https://mern-blog-server-hq7r.onrender.com/api/sign'
    );
    const { signature, timestamp } = signResponse.data;

    const cloudinaryResponse = await axios.post(
      'https://mern-blog-server-hq7r.onrender.com/api/upload',
      {
        file: req.file.buffer,
        timestamp,
        signature,
      }
    );

    const newPost = await postModel.create({
      ...req.body,
      photo: cloudinaryResponse.data.url,
    });

    res.json(newPost);

    console.log('Signature:', signature);
    console.log('Timestamp:', timestamp);
    console.log('req.file:', req.file);
    console.log('Cloudinary Response:', cloudinaryResponse.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Error creating post', details: error.message });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);
    if (post.username === req.body.username) {
      try {
        const update = await postModel.findOneAndUpdate(
          { _id: id },
          { $set: req.body },
          {
            new: true,
          }
        );
        res.json(update);
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new Error('You are not valid user');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const getPost = await postModel.findById(id);
    res.json(getPost);
  } catch (error) {
    throw new Error('Error');
  }
};

const getAllPost = async (req, res) => {
  const username = req.query.user;
  const catName = req.query.category;
  try {
    let posts;
    if (username) {
      posts = await postModel.find({ username });
    } else if (catName) {
      posts = await postModel.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await postModel.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);
    if (post.username === req.body.username) {
      try {
        const deletePost = await postModel.findByIdAndDelete(id);
        res.json('You delete the post');
      } catch (error) {
        throw new Error('Error');
      }
    } else {
      throw new Error('You are not valid user');
    }
  } catch (error) {
    res.status(401).json({ message: 'You can delete only your Posts' });
  }
};

export { createPost, updatePost, getPost, getAllPost, deletePost };
