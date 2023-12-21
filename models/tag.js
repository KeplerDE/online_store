const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
    required: false // Сделано необязательным
  }
}, { timestamps: true });

tagSchema.plugin(uniqueValidator, { message: 'Поле {PATH} должно быть уникальным.' });

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
