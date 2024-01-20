import mongoose from 'mongoose';

var CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const postModel = mongoose.model('Category', CategorySchema);
