import { userModel } from '../models/userModel.js';
import { postModel } from '../models/postModel.js';
import bcrypt from 'bcrypt';
import axios from 'axios';

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
      if (req.file) {
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
        req.body.profilePicture = cloudinaryResponse.data.url;
      }

      const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json({ message: 'You can update only your account' });
  }
};

const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await userModel.findById(req.params.id);

      try {
        // Delete posts of the user
        await postModel.deleteMany({ username: user.username });

        // Delete the user's profile picture from Cloudinary
        if (user.profilePicture) {
          const publicId = user.profilePicture.split('/').pop().split('.')[0];
          await axios.delete(
            `https://mern-blog-server-hq7r.onrender.com/api/upload/${publicId}`
          );
        }

        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json('User not found!');
    }
  } else {
    res.status(401).json('You can delete only your account!');
  }
};

export { getSingleUser, updateUser, deleteUser };
