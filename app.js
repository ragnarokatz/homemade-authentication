require('dotenv').config();

const debug = require('debug')('api:app');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const accounts = require('./controllers/account');

app.get('/', (req, res) => {
  debug('visiting root');
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/protected', (req, res) => {
  debug('visiting protected route');
  res.sendFile(path.join(__dirname, '/protected.html'));
});

app.post('/account/register', async (req, res) => {
  debug('adding account');
  accounts
    .validateRegister(req.body)
    .then((data) => {
      accounts
        .addAccount(data)
        .then((result) => {
          res.json(result);
        })
        .catch((error) =>
          res.status(404).json({
            message: error,
          })
        );
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.post('/account/login', async (req, res) => {
  debug('adding account');
  accounts
    .validateLogin(req.body)
    .then((data) => {
      accounts
        .verifyAccount(data)
        .then((result) => {
          res.json(result);
        })
        .catch((error) =>
          res.status(404).json({
            message: error,
          })
        );
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.post('/account/authenticate', async (req, res) => {
  debug('adding account');
  accounts
    .validateAccount(req.body)
    .then((data) => {
      accounts
        .addAccount(data)
        .then((result) => {
          res.json(result);
        })
        .catch((error) =>
          res.status(404).json({
            message: error,
          })
        );
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.get('/account/logout', async (req, res) => {
  debug('adding account');
  accounts
    .validateAccount(req.body)
    .then((data) => {
      accounts
        .addAccount(data)
        .then((result) => {
          res.json(result);
        })
        .catch((error) =>
          res.status(404).json({
            message: error,
          })
        );
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.use((req, res) => {
  debug('visiting non existing resource');
  res.status(404).send('Resource not found');
});

module.exports = app;
