require('dotenv').config();

// Kirjastot
const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

// Tuodaan reittitiedostot
const publicRoutes = require('./routes/public-routes');
const privateRoutes = require('./routes/private-routes');
const userRoutes = require('./routes/user.routes');
const awsRoutes = require('./routes/aws-routes');
// Express-sovellus
const app = express();

const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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

// Julkiset reseptireitit
app.use('/api/recipes', publicRoutes);

// Yksityiset suojatut reseptireitit
app.use('/api/my-recipes', checkAuth, privateRoutes);

// Käyttäjään liittyvät reitit
app.use('/api/user', checkAuth, userRoutes);

// aws reitit
app.use('/api/aws', awsRoutes);
// Palvelimen käynnistys
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
