import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

const ratingSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 200,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const productSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxlength: 160,
    text: true,
  },
  slug: {
    type: String,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: 2000,
    text: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 32,
    validate: {
      validator: (value) => value !== 0,
      message: 'Price must be greater than 0.',
    },
  },
  previousPrice: Number,
  color: String,
  brand: String,
  stock: Number,
  shipping: {
    type: Boolean,
    default: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  images: [{
    public_id: {
      type: String,
      default: '',
    },
    secure_url: {
      type: String,
      default: '',
    },
  }],
  sold: {
    type: Number,
    default: 0,
  },
  likes: [likeSchema],
  ratings: [ratingSchema],
}, { timestamps: true });

productSchema.plugin(uniqueValidator);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
