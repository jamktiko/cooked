const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const { validateRecipe } = require('../middleware/validation.middleware');

// Hae omat reseptit
router.get('/', async (req, res) => {
  try {
    // req.user.sub tulee Cognitosta
    const recipes = await Recipe.find({ sub: req.user.sub })
      .select('name image created description tags')
      .sort({
        created: -1,
      });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Recipes could not be retrieved' });
  }
});

// Hae yksi tietty resepti ID:n perusteella
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      sub: req.user.sub,
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipes not found' });
    }

    res.json(recipe);
  } catch (err) {
    console.error('Hakuherja:', err.message);
    res.status(500).json({ error: 'Error occurred while fetching the recipe' });
  }
});

// Luo uusi resepti
router.post('/create', validateRecipe, async (req, res) => {
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newRecipe = new Recipe({
      ...req.body,
      sub: req.user.sub,
    });

    const savedRecipe = await newRecipe.save();

    console.log(`✅ Recipe created: ${savedRecipe.name} by ${req.user.sub}`);

    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error('SERVER ERROR DURING CREATE:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.message,
      });
    }

    res.status(500).json({ error: 'Database error' });
  }
});

// Muokkaa olemassa olevaa reseptiä
router.put('/update/:id', validateRecipe, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userSub = req.user.sub;

    // Varmistaa, että resepti löytyy ja kuuluu käyttäjälle
    const recipe = await Recipe.findOne({ _id: recipeId, sub: userSub });

    if (!recipe) {
      return res.status(404).json({
        error: 'Recipe not found or you do not have permission to edit it',
      });
    }

    // Päivittää tiedot (Mongoose findOneAndUpdate)
    // Käytetään $set: req.body, jotta vain lähetetyt kentät muuttuvat
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    console.log(`Recipe "${updatedRecipe.name}" updated.`);
    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ error: 'Failed to update the recipe' });
  }
});

// Poista resepti (Delete)
router.delete('/delete/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userSub = req.user.sub;
    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: recipeId,
      sub: userSub,
    });

    if (!deletedRecipe) {
      return res.status(404).json({
        error: 'Recipe not found or you do not have permission to delete it',
      });
    }

    console.log(`Recipe "${deletedRecipe.name}" deleted.`);
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete the recipe' });
  }
});

module.exports = router;
