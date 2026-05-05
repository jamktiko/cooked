const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// Hakee kaikkien julkisten reseptien perustiedot
router.get('/all', async (req, res) => {
  try {
    const recipes = await Recipe.find({ public: true })
      .select('name image created description tags duration servings')
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
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Id is invalid' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
