const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  // Viittaus käyttäjään Cogniton 'sub' -tunnisteella
  user_sub: { 
    type: String, 
    required: true, 
    index: true 
  },
  
  // Viittaus reseptiin MongoDB:n oman ID:n avulla
  recipe_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Recipe', // Tämän on täsmättävä Recipe-mallin ensimmäiseen parametriin
    required: true 
  },
  
  // Tallennetaan lisäysajankohta, jos haluat järjestää suosikit "uusimmat ensin"
  added_at: { 
    type: Date, 
    default: Date.now 
  }
});

/**
 * UNIikki INDEKSI (Erittäin tärkeä!)
 * Estää saman käyttäjän tallentamasta samaa reseptiä suosikkeihin useita kertoja.
 * 1 tarkoittaa nousevaa järjestystä.
 */
FavoriteSchema.index({ user_sub: 1, recipe_id: 1 }, { unique: true });

// Luodaan malli, josta tulee tietokantaan kokoelma 'favorites'
module.exports = mongoose.model('Favorite', FavoriteSchema);