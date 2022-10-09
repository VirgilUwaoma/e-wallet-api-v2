# E-WALLET-API

## Introduction

This is a backend API server that allows users to create an account with an associated wallet which they can fund, withdraw from and transfer funds to other users using specific endpoint.

This application is built using:

- NodeJS
- KnexJS ORM
- MySQL Database

## Getting Started

- Base URL: This Backend API Sever is hosted on Heroku and has a base URL [`https://young-crag-52212.herokuapp.com/`.](https://young-crag-52212.herokuapp.com/.)
- Authentication: This version of the application requires jwts token authentication to access some endpoints. This token is generated from the "/api/v1/auth/login " endpoint
- This version of the application limits each IP to 100 requests per \`window\` (15 minutes)

**Project Dependencies**

- express
- bcrypt
- knex
- jsonwebtoken
- mysql
- dotenv
- uuid
- joi

## How to setup locally

- Open your terminal and clone this repository using `git clone https://github.com/VirgilUwaoma/e-wallet-api-v2.git
- Navigate to project folder and install dependencies using `npm install`.
- Create .env file and add environment variables using .env.sample as a guide.
- Run the command `npx knex migrate:latest` to create the tables.
- Open terminal and type `npm run test` to run tests.
- Type `npm run devstart` to run server in development mode.
- Type `npm run start` to start server in production mode.
- Use postman and navigate to desired endpoints

## Resource Endpoint Library

A collection of the endpoint library is published on postman and can be accessed using the following link: [`Endpoint Library`.](https://documenter.getpostman.com/view/21398214/2s83zfR5uU)
