const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Hakee kaikkien julkisten reseptien perustiedot
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ public: true })
      .select('name user_sub image created description tags')
      .sort({ created: -1 });

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hakee reseptin ID:n perusteella
router.get('/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findOne({ _id: recipeId, public: true });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

module.exports = router;
