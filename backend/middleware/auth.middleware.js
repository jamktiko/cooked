const { CognitoJwtVerifier } = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('No header');

    const token = authHeader.split(' ')[1];
    const payload = await verifier.verify(token);

    // TÄRKEÄÄ: Tallennetaan käyttäjän tiedot req-objektiin,
    // jotta seuraava funktio voi käyttää niitä.
    req.user = payload;

    next(); // Kaikki kunnossa, siirrytään eteenpäin
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { checkAuth };
