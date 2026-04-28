const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Hae omat reseptit
router.get('/', async (req, res) => {
  // Käytetään '/' jotta se on päätaso
  try {
    // req.user.sub tulee Cognitosta
    const recipes = await Recipe.find({ sub: req.user.sub }).sort({
      created: -1,
    });

    // Jos reseptejä ei ole, palautetaan tyhjä lista (ei virhettä)
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Omien reseptien haku epäonnistui' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Luodaan uusi resepti-olio bodysta tulevalla datalla
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      public: req.body.public || false, // Oletuksena yksityinen
      tags: req.body.tags || [],
      // TÄRKEÄÄ: Otetaan käyttäjän ID auth-middlewaren asettamasta req.user-oliosta
      sub: req.user.sub,
      user_sub: req.user.sub,

      ingredients: req.body.ingredients || [],
    });

    // Tallennetaan tietokantaan
    const savedRecipe = await newRecipe.save();

    // Palautetaan tallennettu resepti ja status 201 (Created)
    res.status(201).json(savedRecipe);

    console.log(
      `Resepti "${savedRecipe.name}" tallennettu käyttäjälle ${req.user.sub}`,
    );
  } catch (err) {
    console.error('Tallennusvirhe:', err.message);
    res.status(400).json({ error: 'Reseptin tallennus epäonnistui' });
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
