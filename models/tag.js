import mongoose from 'mongoose';
import  uniqueValidator from "mongoose-unique-validator"

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 32
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
    required: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false
  }
}, 
{ timestamps: true }
);


tagSchema.plugin(uniqueValidator, " is already taken.");

export default mongoose.models.Tag || mongoose.model("Tag", tagSchema);
