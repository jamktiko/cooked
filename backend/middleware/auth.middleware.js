// AWS:n tarjoama kirjasto JWT-tokenien tarkistamiseen
const { CognitoJwtVerifier } = require('aws-jwt-verify');

// Luodaan verifier-olio, joka keskustelee Cognito User Poolisi kanssa.
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

// Middleware-funktio, joka suoritetaan ennen varsinaista reittikäsittelijää
const checkAuth = async (req, res, next) => {
  try {
    // 1. Haetaan Authorization-otsikko (muodossa "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header puuttuu' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token puuttuu' });
    }
    // Verifier tarkistaa:
    // - Onko token aito (AWS:n allekirjoittama)?
    // - Onko se vanhentunut (expired)?
    // - Onko se tarkoitettu juuri tälle sovellukselle (clientId)?
    const payload = await verifier.verify(token);
    req.user = payload;
    // console.log('COGNITO PAYLOAD SISÄLTÖ:', payload); // Poistettu väliaikaisesti loggaamasta jokaisessa requestissa

    // Kutsutaan next(), joka sallii pyynnön jatkamisen varsinaiseen koodiin (esim. hakuun tietokannasta).
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { checkAuth };
