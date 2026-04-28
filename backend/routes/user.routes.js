const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Varmista, että polku on oikein
const { checkAuth } = require('../middleware/auth.middleware');

// Tämä reitti hoitaa käyttäjän tietojen "synkronoinnin"
router.post('/sync', checkAuth, async (req, res) => {
  try {
    // 1. Poimitaan sub-tunniste validoidusta tokenista (tietoturva-ankkuri)
    const subFromToken = req.user.sub;

    // 2. Poimitaan profiilitiedot, jotka Angular lähettää bodyssä
    const { email, first_name, last_name, user_name } = req.body;

    // 3. Päivitetään käyttäjä tai luodaan uusi (upsert)
    const user = await User.findOneAndUpdate(
      { sub: subFromToken }, // Hakuehto: etsitään subin perusteella
      {
        $set: {
          email: email,
          first_name: first_name,
          last_name: last_name,
          user_name: user_name,
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

    console.log(`Käyttäjä ${user.user_name} synkronoitu tietokantaan.`);
    res.status(200).json(user);
  } catch (error) {
    console.error('Synkronointivirhe:', error.message);
    res.status(500).json({ error: 'Tietojen tallennus epäonnistui' });
  }
});

module.exports = router;
