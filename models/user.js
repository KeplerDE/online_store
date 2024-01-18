import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import Category from '@/models/category'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    minLength: 1,
    maxLength: 20,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    index: true,
    lowercase: true,
    unique: true,
    trim: true,
    minLength: 5,
    maxLength: 50, // Adjusted max length for email
  },
  password: {
    type: String,
    required: [true, "Please enter your password"]
  },
  role: {
    type: String,
    default: 'user',
  },
  image: String,
  resetCode: {
    data: String,
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes in milliseconds
    },
  },
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

export default mongoose.models.User || mongoose.model('User', userSchema);
