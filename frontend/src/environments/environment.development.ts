// environment.development.ts
export const environment = {
  production: false,
  // Pidä tämä juurena, jotta voit käyttää sitä eri serviceissä
  backendApi: 'http://localhost:3000/api',
  logoutUri: 'http://localhost:4200',
  cognitoDomain: 'https://eu-north-1hn9usnbwy.auth.eu-north-1.amazoncognito.com',
  clientId: '31r3baig5pejtegiqopu61pt3',
  redirectUrl: 'http://localhost:4200/login',
  s3BaseUrl: 'https://cookedmedia.s3.eu-north-1.amazonaws.com',
};
