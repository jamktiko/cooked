const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Tämä reitti hoitaa käyttäjän tietojen "synkronoinnin"
router.post('/sync', async (req, res) => {
  console.log('User found from token:', req.user.sub);

  try {
    // 1. Poimitaan sub-tunniste validoidusta tokenista (tietoturva-ankkuri)
    const subFromToken = req.user.sub;

    // 2. Poimitaan profiilitiedot, jotka Angular lähettää bodyssä
    const { email, cognitoId } = req.body;

    // 3. Päivitetään käyttäjä tai luodaan uusi (upsert)
    const user = await User.findOneAndUpdate(
      { sub: subFromToken }, // Hakuehto: etsitään subin perusteella
      {
        $set: {
          email: email,
          last_login: new Date(),
        },
        $setOnInsert: {
          prof_created: new Date(),
          preferred_mode: 'light',
        },
      },
      {
        upsert: true, // Jos ei löydy, luo uusi
        new: true, // Palauta päivitetty versio
        runValidators: true, // Tarkista, että nimet/sähköposti täyttävät Scheman ehdot
      },
    );

    console.log(`User ${user.username} synced with database.`);
    res.status(200).json(user);
  } catch (error) {
    console.error('SYNC ERROR DETAILS:', error); // TÄMÄ ON LISÄTTY: logittaa koko virheen, ei vain viestiä
    res
      .status(500)
      .json({ error: 'Failed to sync user data', details: error.message });
  }
});

// 2. Kirjautuneen käyttäjän profiili
router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne({ sub: req.user.sub });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Käyttäjän profiilin viimeistely
router.patch('/complete-profile', async (req, res) => {
  try {
    const { username, info, prof_picture } = req.body;
    const sub = req.user.sub;
    const updatedUser = await User.findOneAndUpdate(
      { sub: sub },
      {
        $set: {
          username: username,
          info: info,
          isProfileComplete: true,
          prof_picture: prof_picture,
        },
      },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'error in updating profile', error: err.message });
  }
});
module.exports = router;
