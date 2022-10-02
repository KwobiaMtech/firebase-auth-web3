<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A sample nestjs applicaiton which demonstrate the use of

- Firebase Login and Registration API
- NestJs Custom Guards
- NestJs Custom Firebase Strategy
- NestJs Swagger with the ability to test api in browser using JWT token

- Create a Web3 service and run sample transaction

## Installation

```bash
$ yarn install

```

## Running the app

- Create Firebase Account
- Download Config file in json from firebase service accounts by generating private key
- Export json file in working environment. Eg

```bash

export GOOGLE_APPLICATION_CREDENTIALS="path to firabase sdk/firebasesdk.json"

```

- Convert json objects for both sdk and client side into Base64 encoded string
- Call Base64 encoded string in .env file

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Running console commands

Got to <a href="http://localhost:3000/api/docs ">http://localhost:3000/api/docs</a> to find the swagger doc.

## Test

```bash
# e2e tests
$ yarn test:e2e

```

## License

Nest is [MIT licensed](LICENSE).
