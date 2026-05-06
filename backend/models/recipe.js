const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Reseptin nimi on pakollinen'],
    trim: true,
  },
  ingredients: [
    {
      amount: {
        type: Number,
        required: true,
        min: [0, 'Määrä ei voi olla negatiivinen'],
      },
      unit: { type: String, trim: true },
      name: { type: String, required: true, lowercase: true },
    },
  ],
  sub: {
    type: String,
    required: true,
    index: true,
  },
  image: { type: String },
  created: {
    type: Date,
    default: Date.now,
  },
  description: { type: String },
  directions: [{ type: String }],
  tags: [{ type: String, index: true }],
  servings: {
    type: Number,
    min: 1,
    default: 1,
  },
  duration: {
    type: Number,
    min: 0,
  },
  public: {
    type: Boolean,
    default: false,
  },
});
// Määritellään tekstihakuindeksi hakutoiminnallisuutta varten
RecipeSchema.index(
  {
    name: 'text',
    tags: 'text',
    'ingredients.name': 'text',
    description: 'text',
  },
  {
    // Painoarvot: määrittää mikä kenttä on tärkein hakutuloksen osumatarkkuudessa
    weights: {
      name: 10, // Osuma nimessä on tärkein
      tags: 5, // Tägit ovat vahvoja avainsanoja
      'ingredients.name': 3, // Ainesosat ovat tärkeitä erityisesti "mitä jääkaapista löytyy" -hauissa
      description: 1, // Kuvaus tuo lisäkontekstia, mutta on vähemmän painava
    },
    name: 'recipe_text_index', // Indeksin nimi tietokannassa
    default_language: 'fi', // Suomen kielen tuki (jos sanot "porkkanoita", haku ymmärtää myös "porkkana")
  },
);

module.exports = mongoose.model('Recipe', RecipeSchema, 'recipes');
