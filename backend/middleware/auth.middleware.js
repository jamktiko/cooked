// AWS:n tarjoama kirjasto JWT-tokenien tarkistamiseen
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const User = require('../models/users');

// Luodaan verifier-olio, joka keskustelee Cognito User Poolisi kanssa.
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

// Middleware-funktio, joka suoritetaan ennen varsinaista reittikäsittelijää
const checkAuth = async (req, res, next) => {
  try {
    // Haetaan HTTP-pyynnön otsikoista (headers) "authorization" -kenttä
    const authHeader = req.headers.authorization;

    // Jos otsikkoa ei ole, heitetään virhe, joka siirtää meidät catch-lohkoon
    if (!authHeader) throw new Error('No header');
    const token = authHeader.split(' ')[1];

    // Verifier tarkistaa:
    // - Onko token aito (AWS:n allekirjoittama)?
    // - Onko se vanhentunut (expired)?
    // - Onko se tarkoitettu juuri tälle sovellukselle (clientId)?
    const payload = await verifier.verify(token);

    // KÄYTTÄJÄN TALLENNUS/PÄIVITYS
    // Etsitään käyttäjä 'sub'-kentän perusteella
    const user = await User.findOneAndUpdate(
      { sub: payload.sub },
      {
        $set: { lastLogin: new Date() },
        $setOnInsert: {
          sub: payload.sub,
          username: payload.username || 'New User',
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    // Jos tarkistus menee läpi, tallennetaan tokenin sisältämä tieto req.user-olioon.
    req.user = payload;
    req.dbUser = user;

    // Kutsutaan next(), joka sallii pyynnön jatkamisen varsinaiseen koodiin (esim. hakuun tietokannasta).
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { checkAuth };
