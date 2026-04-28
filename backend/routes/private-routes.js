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

// Luo uusi (Create)
router.post('/', async (req, res) => {
  // ...
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
