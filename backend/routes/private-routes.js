const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const { validateRecipe } = require('../middleware/validation.middleware');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Hae omat reseptit
router.get('/', async (req, res) => {
  try {
    // req.user.sub tulee Cognitosta
    const recipes = await Recipe.find({ sub: req.user.sub })
      .select('name image created description tags duration servings public')
      .sort({
        created: -1,
      });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Recipes could not be retrieved' });
  }
});

// Omien yksityisten reseptien haku (Regex live-haku + tietoturva)
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Turvaraja: Hakusanan maksimipituus 50 merkkiä
    if (!searchQuery || searchQuery.length > 50) {
      return res.status(400).json({
        error: 'Hakusana on virheellinen tai liian pitkä (max 50 merkkiä)',
      });
    }

    // 1. Luodaan turvallinen regex-lauseke hakusanasta
    const safeRegex = new RegExp(
      searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );

    // 2. Määritellään hakuehdot: etsi näistä kentistä, mutta VAIN käyttäjän omista resepteistä
    const searchConditions = {
      sub: req.user.sub,
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
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit)
      .maxTimeMS(1000); // Turvamekanismi DOS-hyökkäyksiä vastaan

    const totalCount = await Recipe.countDocuments(searchConditions);

    res.json({
      recipes,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    console.error('Private search error:', err.message);
    res.status(500).json({ error: 'Haku epäonnistui' });
  }
});
// Omien yksityisten reseptien haku (Regex live-haku + tietoturva)
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Turvaraja: Hakusanan maksimipituus 50 merkkiä
    if (!searchQuery || searchQuery.length > 50) {
      return res.status(400).json({
        error: 'Hakusana on virheellinen tai liian pitkä (max 50 merkkiä)',
      });
    }

    // 1. Luodaan turvallinen regex-lauseke hakusanasta
    const safeRegex = new RegExp(
      searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );

    // 2. Määritellään hakuehdot: etsi näistä kentistä, mutta VAIN käyttäjän omista resepteistä
    const searchConditions = {
      sub: req.user.sub,
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
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit)
      .maxTimeMS(1000); // Turvamekanismi DOS-hyökkäyksiä vastaan

    const totalCount = await Recipe.countDocuments(searchConditions);

    res.json({
      recipes,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    console.error('Private search error:', err.message);
    res.status(500).json({ error: 'Haku epäonnistui' });
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

    // 1. Etsi resepti ensin, jotta saat S3-avaimen (Key) talteen
    const recipe = await Recipe.findOne({ _id: recipeId, sub: userSub });

    if (!recipe) {
      return res
        .status(404)
        .json({ error: 'Recipe not found or no permission' });
    }

    // 2. Poista kuva S3:sta (jos reseptillä on kuva)
    if (recipe.image) {
      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: recipe.image,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    // 3. Poista vasta sitten dokumentti tietokannasta
    await Recipe.deleteOne({ _id: recipeId });
    if (typeof Favorite !== 'undefined') {
      // Varmista, että Favorite-malli on importattu
      await Favorite.deleteMany({ recipe_id: recipeId });
    }
    res.status(200).json({ message: 'Recipe and image deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
