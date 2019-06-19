'use strict';
require('dotenv').config();
const express  = require('express');
const slackend = require('./index');

const BASE_URL = process.env.BASE_URL || '/';
const HOST     = process.env.HOST     || 'localhost';
const PORT     = process.env.PORT     || 3000;

const app = express();
const api = slackend({
  client_id:          process.env.SLACK_CLIENT_ID,
  client_secret:      process.env.SLACK_CLIENT_SECRET,
  oauth_error_uri:    process.env.SLACK_OAUTH_ERROR_URI,
  oauth_redirect_uri: process.env.SLACK_OAUTH_REDIRECT_URI,
  oauth_success_uri:  process.env.SLACK_OAUTH_SUCCESS_URI,
  signing_secret:     process.env.SLACK_SIGNING_SECRET,
  signing_version:    process.env.SLACK_SIGNING_VERSION,
  token:              process.env.SLACK_TOKEN,
});
const pub = (req, res) => {
  console.log(`\n${req.method} ${req.path}`);
  console.log(`├── type:    ${res.locals.type}`);
  console.log(`├── id:      ${res.locals.id}`);
  console.log(`└── message: ${JSON.stringify(res.locals.message)}`);
  res.json(res.locals);
};
const log = () => {
  console.log(`> Listening on ${HOST}:${PORT}${BASE_URL}\n`);

  console.log(`# Callback`)
  console.log(`curl --request POST \\`)
  console.log(`  --data 'payload=%7B%22callback_id%22%3A%22fizz%22%7D' \\`)
  console.log(`  --url 'http://${HOST}:${PORT}${BASE_URL}callbacks'\n`)

  console.log(`# Event`)
  console.log(`curl --request POST \\`);
  console.log(`  --header 'Content-Type: application/json' \\`);
  console.log(`  --data '{"type": "event_callback", "event": {"type": "team_join"}}' \\`);
  console.log(`  --url 'http://${HOST}:${PORT}${BASE_URL}events'\n`);

  console.log(`# Slash command`);
  console.log(`curl --request POST \\`);
  console.log(`  --data 'fizz=buzz' \\`);
  console.log(`  --url 'http://${HOST}:${PORT}${BASE_URL}slash/fizz'\n`);
};
app.use(BASE_URL, api, pub);
app.listen(PORT, log);
