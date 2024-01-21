import { userModel } from '../models/userModel.js';
import { postModel } from '../models/postModel.js';
import axios from 'axios';

const createPost = async (req, res) => {
  try {
    const image = req.body.image;

    const signatureResponse = await axios.post(
      'https://mern-blog-server-hq7r.onrender.com/api/sign-upload',
      { folder: 'images' }
    );

    const { timestamp, signature } = signatureResponse.data;

    const cloudinaryResponse = await axios.post(
      'https://api.cloudinary.com/v1_1/dn1d2qvqd/image/upload',
      {
        file: image,
        timestamp,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
        upload_preset: 'images_preset',
        folder: 'images',
      }
    );

    const imageUrl = cloudinaryResponse.data.secure_url;

    const newPost = await postModel.create({
      ...req.body,
      photo: imageUrl,
    });

    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
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
