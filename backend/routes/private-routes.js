const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { validateRecipe } = require('../middleware/recipe.validation');

// Hae omat reseptit
router.get('/', async (req, res) => {
  try {
    // req.user.sub tulee Cognitosta
    const recipes = await Recipe.find({ sub: req.user.sub }).sort({
      created: -1,
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Recipes could not be retrieved' });
  }
});

// Luo uusi resepti
router.post('/create', validateRecipe, async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      sub: req.user.sub,
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);

    console.log(`Recipe created. Image: ${savedRecipe.image}`);
  } catch (err) {
    console.error('Save error:', err.message);
    res.status(500).json({ error: 'Database error while saving the recipe' });
  }
});

// Muokkaa (Update)
router.put('/:id', async (req, res) => {
  // ...
});

// Poista (Delete)
router.delete('/:id', async (req, res) => {
  // ...
});

module.exports = router;
