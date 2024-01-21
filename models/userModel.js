import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: Object,
      default: {
        url: 'avtar.jpg',
        public_id: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.isPasswordMatched = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export const userModel = mongoose.model('User', UserSchema);
