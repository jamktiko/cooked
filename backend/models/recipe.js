const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user_sub: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Reseptin nimi on pakollinen'],
    trim: true,
  },
  ingredients: [
    {
      amount: {
        type: Number,
        required: true,
        min: [0, 'Määrä ei voi olla negatiivinen'],
      },
      unit: { type: String, trim: true },
      name: { type: String, required: true, lowercase: true },
    },
  ],
  sub: {
    type: String,
    required: true,
    index: true,
  },
  image: { type: String },
  created: {
    type: Date,
    default: Date.now,
  },
  description: { type: String },
  directions: [{ type: String }],
  tags: [{ type: String, index: true }],
  servings: {
    type: Number,
    min: 1,
    default: 1,
  },
  duration: {
    type: Number,
    min: 0,
  },
  public: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Recipe', RecipeSchema, 'recipes');
