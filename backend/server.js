// Kirjastot
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

// Express-sovellus
const app = express();

// Middlewaret
app.use(express.json());

// MongoDB-yhteys
const mongoURL = process.env.MONGODB_URL;

mongoose
  .connect(mongoURL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:');
    console.error(err.message);
  });

// REITIT

// Testireitti
app.get('/', (req, res) => {
  res.send('Backend works!');
});

// Hae kaikki reseptit, joissa public: true
app.get('/api/recipes/public', async (req, res) => {
  try {
    // Haetaan vain ne, joissa public: true
    const recipes = await Recipe.find({ public: true }).sort({ created: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Testireitti jossa simuloitu yhden käyttäjän reseptien haku
app.get('/api/test-my-recipes', async (req, res) => {
  try {
    const mockSubFromCognito = 'cognito-id-67890-fghij';
    const recipes = await Recipe.find({ sub: mockSubFromCognito });

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: 'Reseptejä ei löytynyt tällä subilla.' });
    }

    res.json({
      info: `Haettu käyttäjän ${mockSubFromCognito} reseptit`,
      count: recipes.length,
      results: recipes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Palvelimen käynnistys
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Test all public recipes at: http://localhost:${PORT}/api/recipes/public`,
  );
  console.log(
    `Test my recipes at: http://localhost:${PORT}/api/test-my-recipes`,
  );
});
