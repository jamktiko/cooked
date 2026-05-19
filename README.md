# COOKED-APP

A modern recipe app that lets you add recipes, save your favorites and share your culinary creations with the community.

## Description

Cooked is a full stack application where the frontend uses angular and backend uses node + express and the database is mongoDB. The application depends on a few AWS services including: Cognito for login, S3 buckets for images and hosting the angular project, EC2 instance for the backend. We also used Elastic Beanstalk for easy deployment of EC2 and CloudFront for the routing.

### Features:

- Login using Cognito or Google
- Add new recipes
- Favorite recipes
- Browse public recipes
- Edit your own recipes
- Delete recipes
- Swipe to randomize recipes
- Profile, including picture and username
- Search functionality

## Getting Started

### Dependencies

Frontend

- Angular v21
- angular-auth-oidc-client (for Cognito login)
- TailwindCSS
- rxjs

Backend

- Joi (validation)
- aws-sdk(/client-s3, s3-request-presigner)
- aws-jwt-verify
- cors
- dotenv
- mongoose
- express

### Installing and executing

AWS

1. Setup Elastic Beanstalk (EC2 instance)
2. Setup S3 bucket for static website hosting
3. Setup S3 bucket for the images
4. Setup CloudFront for routing the backend to /api route
5. Setup Cognito with user pools and app client
6. Setup IAM users for the app

MongoDB

1. Setup MongoDB to accept requests from the address of your backend, this may vary, we used MongoDB Atlas for easy setup of clusters and users.
2. Add users for management and application access

Modifications:

1. Create .env file inside of backend folder (for contents see .env.example)
2. Modify environment files in the frontend (angular project)
3. Make sure the redirectUrl, clientId and cognitoDomain point to your cognito service and that the rest of OIDC configs are correct (found in app.config.ts).
4. Setup CORS for the backend and s3 buckets, especially for the image bucket.

How to run:

1. Clone this repo
2. Run `npm i` inside of both frontend and backend folders
3. Go to the backend folder and run `node server.js` (if setup is done correctly, the server should start up)
4. Go to the frontend folder and run `npm start` for local development or `npm run build -- --configuration=production` for production build (hosting in S3)

## Help

- For problems with Cognito login, double check that all the OIDC Configurations are correct and that the redirect addresses match up with the ones configured in aws control panel.
- Make sure to read the documentations regarding Cognito and angular-auth-oidc-client.

## Authors

- Eetu Auvinen (Product owner, Full-Stack dev)
- Mikael Makkonen (AWS-specialist, Full-Stack dev)
- Essi Kaukometsä (Scrum master, UI/UX designer)
- Janika Rahikainen (GIT-specialist, Full-Stack dev)

## License

This project is licensed under the CC BY-SA 4.0 License - see the LICENSE.md file for details

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png

## Acknowledgments

- AI was used heavily in the development of this project.
- This project was part of JAMK TIKO Software project 2 (2026).
