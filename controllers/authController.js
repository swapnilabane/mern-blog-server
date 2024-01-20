import { userModel } from '../models/userModel.js';

const register = async (req, res) => {
  const email = req.body.email;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    try {
      const doc = new userModel({
        username: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
      });
      const newUser = await doc.save();
      res.json(newUser);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res.status(500).json({ message: 'User already exists' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user != null) {
      if (user && (await user.isPasswordMatched(password))) {
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          profilePic: user.profilePic,
        });
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { register, loginUser };
