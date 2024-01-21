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
  try {
    if (req.body.userId !== req.params.id) {
      return res
        .status(401)
        .json({ message: 'You can update only your account' });
    }

    // Hash the password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Check if a file is provided for profile picture update
    if (req.file) {
      const image = req.file.buffer; // Directly accessing file content

      // Fetch Cloudinary signature
      const signatureResponse = await axios.post(
        'https://mern-blog-server-hq7r.onrender.com/api/sign-upload',
        { folder: 'profile-pics' }
      );

      const { timestamp, signature } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', image, { filename: 'profile-pic.jpg' });
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('api_key', process.env.CLOUDINARY_API_KEY);
      formData.append('upload_preset', 'profile-pics-preset');
      formData.append('folder', 'profile-pics');

      // Upload to Cloudinary
      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dn1d2qvqd/image/upload',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      req.body.profilePic = cloudinaryResponse.data.secure_url;
    }

    // Use findByIdAndUpdate to get the updated user data
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Return the updated document
    );

    // Send back the updated user data, including profilePic
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
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
