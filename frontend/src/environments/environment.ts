const cognitoDomain = 'https://eu-north-1hn9usnbwy.auth.eu-north-1.amazoncognito.com';
const clientId = '31r3baig5pejtegiqopu61pt3';
const callbackUrl = 'https://d3e0nibb1zujy6.cloudfront.net/login';

export const environment = {
  backendApi: '/api',
  logoutUri: 'https://d3e0nibb1zujy6.cloudfront.net',
  cognitoDomain: 'https://eu-north-1hn9usnbwy.auth.eu-north-1.amazoncognito.com',
  clientId: '31r3baig5pejtegiqopu61pt3',
  redirectUrl: 'https://d3e0nibb1zujy6.cloudfront.net/login',
  s3BaseUrl: 'https://cookedmedia.s3.eu-north-1.amazonaws.com',

  loginUrl: `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(callbackUrl)}`,
  signupUrl: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(callbackUrl)}`,
};
