require('dotenv').config();

// Kirjastot
const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

// Express-sovellus
const app = express();

// Middlewaret
app.use(express.json());
const { checkAuth } = require('./middleware/auth.middleware');

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

app.get('/', (req, res) => {
  res.send('Backend works!');
});

// Hakee kaikkien julkisten reseptien perustiedot
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({ public: true })
      .select('name user_sub image created description tags')
      .sort({ created: -1 });

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hakee reseptin ID:n perusteella
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findOne({ _id: recipeId, public: true });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

// Testireitti jossa simuloitu yhden käyttäjän reseptien haku
// Pitää päivittää toimimaan oikealla Cognitolta palautuvalla subillä
app.get('/test-my-recipes', checkAuth, async (req, res) => {
  try {
    const mockSubFromCognito = 'cognito-id-67890-fghij';
    const recipes = await Recipe.find({ sub: mockSubFromCognito });

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: 'Recipes not found with this sub.' });
    }

    res.json({
      info: `Retrieved recipes for user ${mockSubFromCognito}`,
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
  console.log(`Test all public recipes at: http://localhost:${PORT}/recipes`);
  console.log(`Test my recipes at: http://localhost:${PORT}/test-my-recipes`);
});
