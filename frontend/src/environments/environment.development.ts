const cognitoDomain = 'https://eu-north-1hn9usnbwy.auth.eu-north-1.amazoncognito.com';
const clientId = '31r3baig5pejtegiqopu61pt3';
const callbackUrl = 'http://localhost:4200/login';

export const environment = {
  production: false,
  // Keep this as the root so it can be used by different services
  backendApi: 'http://localhost:3000/api',
  logoutUri: 'http://localhost:4200',
  cognitoDomain: 'https://eu-north-1hn9usnbwy.auth.eu-north-1.amazoncognito.com',
  clientId: '31r3baig5pejtegiqopu61pt3',
  redirectUrl: 'http://localhost:4200/login',
  s3BaseUrl: 'https://cookedmedia.s3.eu-north-1.amazonaws.com',

  loginUrl: `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(callbackUrl)}`,
  signupUrl: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(callbackUrl)}`,
};
