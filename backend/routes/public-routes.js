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

router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Hakusana (q) on pakollinen' });
    }

    // 1. Luodaan turvallinen regex-lauseke hakusanasta
    // 'i' tekee hausta kirjainkoosta riippumattoman (Bolo == bolo)
    // RegExp estää mahdollisten regex-erikoismerkkien kaatumisen
    const safeRegex = new RegExp(
      searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );

    // 2. Määritellään hakuehdot: etsi näistä kentistä
    const searchConditions = {
      public: true,
      $or: [
        { name: safeRegex },
        { description: safeRegex },
        { 'ingredients.name': safeRegex },
        { tags: safeRegex },
      ],
    };

    // 3. Etsitään reseptit näillä ehdoilla
    const recipes = await Recipe.find(searchConditions)
      .select('name image created description tags duration servings')
      .sort({ created: -1 }) // Sortataan uusimmat ensin, koska Regex ei osaa laskea textScore-osuvuutta
      .skip(skip)
      .limit(limit);

    // Lasketaan tulokset sivutusta varten
    const totalCount = await Recipe.countDocuments(searchConditions);

    res.json({
      recipes,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
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
