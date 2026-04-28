const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Hae omat reseptit
router.get('/my', async (req, res) => {
  const userSub = req.user.sub;
  // ...
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
