import { userModel } from '../models/userModel.js';
import { postModel } from '../models/postModel.js';
import bcrypt from 'bcrypt';

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
        await postModel.deleteMany({ username: user.username });
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
