// environment.development.ts
export const environment = {
  production: false,
  // Pidä tämä juurena, jotta voit käyttää sitä eri serviceissä
  backendApi: 'http://localhost:3000',
  logoutUri: 'http://localhost:4200',
  cognitoDomain: 'https://eu-north-1hn9usnbwy.auth.eu-north-1.amazoncognito.com',
  clientId: '31r3baig5pejtegiqopu61pt3',
  // TÄMÄ ON TÄRKEÄ: Ohjaa takaisin omalle koneelle
  redirectUrl: 'http://localhost:4200/login',
};
