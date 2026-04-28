require('dotenv').config();

// Kirjastot
const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

// Tuodaan reittitiedostot
const publicRoutes = require('./routes/public-routes');
const privateRoutes = require('./routes/private-routes');
const userRoutes = require('./routes/user.routes');
// Express-sovellus
const app = express();

const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
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

// Reittien kytkeminen
// Julkiset reseptireitit (esim. GET /recipes)
app.use('/recipes', publicRoutes);
// Yksityiset suojatut reseptireitit (esim. GET /my-recipes)
app.use('/my-recipes', checkAuth, privateRoutes);

app.use('/api/user', userRoutes);
// Palvelimen käynnistys
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test all public recipes at: http://localhost:${PORT}/recipes`);
  console.log(`Test my recipes at: http://localhost:${PORT}/my-recipes`);
});
