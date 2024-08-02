# README

<h1 align="center">
  <br>
  <a href="https://openpecha.org"><img src="https://avatars.githubusercontent.com/u/82142807?s=400&u=19e108a15566f3a1449bafb03b8dd706a72aebcd&v=4" alt="OpenPecha" width="150"></a>
  <br>
</h1>

## Monlam AI Tools

## Owner(s)

- [@tenkus47](https://github.com/tenkus47)
- [@tentamdin](https://github.com/tentamdin)

- ## Prerequisites
Before you begin, ensure you have the following installed on your local machine:

- Node 16V above
- Postgres 14V above

## Development

### 1. Clone the Repository
First, clone the repository to your local machine:

bash

```Copy code
git clone https://github.com/OpenPecha/monlam-ai-tools.git
cd monlam-ai-tools
```

### 2. Install the dependencies

```sh
npm install 
```

### 3. Set up Environment variable

```plaintext
   DATABASE_URL: set up a postgres database and provide the link here   
   MAX_TEXT_LENGTH_MT : max number text accepted in Machine translation
   MAX_TEXT_LENGTH_TTS: max number of text supported in text to speech
   AUTH0_CLIENT_ID : client id from auth0
   AUTH0_CLIENT_SECRET :client secret from auth0
   AUTH0_DOMAIN : domain name provided by auth0
   AUTH0_CALLBACK_URL : callback url to where the auth0 should redirect
   OPENAI_KEY : Chatgpt-api key (not required)
   ORIGIN : domain name where the app is hosted
   UNLEASH_FLAG_URL : feature flag url (not required)
   UNLEASH_FLAG_KEY : feature flag key (not required)
   API_HIT_LIMIT : limit for hitting api per user (not required)
   BUCKET_NAME_PRODUCTION : aws bucket name
   AWS_ACCESS_KEY_ID_PRODUCTION: aws access key
   AWS_SECRET_ACCESS_KEY_PRODUCTION :aws secret key
   AWS_REGION_PRODUCTION: aws region
   FEEDBUCKET_ACCESS : feedbucket access key (not required)
   FEEDBUCKET_TOKEN :feedbucket token (not required)
   FILE_SUBMIT_URL : domain url for monlam api
   API_ACCESS_KEY : token used for verification of api user
   COOKIE_SECRET : session and cookie secret (can be anything not exposed)
```

### 3. Setup database

after setting up DATABASE_URL in .env file

```sh
npx prisma migrate deploy
```
   
   
### 4. Run app locally

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
