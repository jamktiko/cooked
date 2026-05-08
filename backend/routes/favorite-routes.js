const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorites');

// Lisää tai poistaa suosikin riippuen onko se jo olemassa
router.post('/toggle', async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user_sub = req.user?.sub || req.auth?.sub;

    if (!recipeId) {
      return res.status(400).json({ error: 'recipeId puuttuu' });
    }

    const existing = await Favorite.findOne({ user_sub, recipe_id: recipeId });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ action: 'removed', isFavorite: false });
    } else {
      const newFav = new Favorite({ user_sub, recipe_id: recipeId });
      await newFav.save();
      return res.status(201).json({ action: 'added', isFavorite: true });
    }
  } catch (err) {
    console.error('Virhe toggle-toiminnossa:', err);
    res.status(500).json({ error: 'Palvelinvirhe' });
  }
});

// Hakee kaikki käyttäjän suosikit ja liittää niihin reseptin tiedot
router.get('/', async (req, res) => {
  try {
    const user_sub = req.user?.sub || req.auth?.sub;

    const favorites = await Favorite.find({ user_sub })
      .populate('recipe_id')
      .sort({ added_at: -1 });

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tarkistaa onko tietty resepti suosikki (esim. sydän-ikonin väriä varten)
router.get('/status/:recipeId', async (req, res) => {
  try {
    const user_sub = req.user?.sub || req.auth?.sub;
    const isFav = await Favorite.exists({
      user_sub,
      recipe_id: req.params.recipeId,
    });
    res.json({ isFavorite: !!isFav });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
