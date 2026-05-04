// environment.development.ts
export const environment = {
  production: false,
  // Pidä tämä juurena, jotta voit käyttää sitä eri serviceissä
  backendApi: 'http://localhost:3000',
  logoutUri: 'http://localhost:4200',
  cognitoDomain: 'https://eu-north-180236gypt.auth.eu-north-1.amazoncognito.com',
  clientId: '3b6d5hg51lp4i1p1d97eibom9p',
  // TÄMÄ ON TÄRKEÄ: Ohjaa takaisin omalle koneelle
  redirectUrl: 'http://localhost:4200/login',
};
