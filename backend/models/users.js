const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Cogniton yksilöllinen tunniste
  sub: { 
    type: String, 
    required: [true, 'Sub-tunniste on pakollinen'], 
    unique: true, 
    index: true 
  },
  
  prof_picture: { 
    type: String, 
    default: '' // Tyhjä merkkijono oletuksena, jos kuvaa ei ole vielä ladattu
  },
  
  info: { 
    type: String, 
    trim: true, 
    maxlength: [500, 'Kuvaus on liian pitkä'] 
  },
  
  user_name: { 
    type: String, 
    required: [true, 'Nimimerkki on pakollinen'], 
    unique: true, 
    trim: true,
    minlength: [3, 'Nimimerkin on oltava vähintään 3 merkkiä pitkä']
  },
  
  first_name: { 
    type: String, 
    required: [true, 'Etunimi on pakollinen'],
    trim: true 
  },
  
  last_name: { 
    type: String, 
    required: [true, 'Sukunimi on pakollinen'],
    trim: true 
  },
  
  email: { 
    type: String, 
    required: [true, 'Sähköposti on pakollinen'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    // Valinnainen: Yksinkertainen regex-validointi sähköpostille
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Anna kelvollinen sähköpostiosoite']
  },
  
  prof_created: { 
    type: Date, 
    default: Date.now 
  },
  
  last_login: { 
    type: Date, 
    default: Date.now 
  },
  
  preferred_mode: { 
    type: String, 
    enum: ['light', 'dark'], // Vain nämä kaksi vaihtoehtoa sallittu
    default: 'light' 
  }
});

// Luodaan malli. Mongoose tekee tästä automaattisesti 'users'-kokoelman tietokantaan.
module.exports = mongoose.model('User', UserSchema, 'users');