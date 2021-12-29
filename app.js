require('dotenv').config();

const debug = require('debug')('api:app');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const SECRET = process.env.SECRET || 'secret';
const accounts = require('./controllers/account');

app.get('/', (req, res) => {
  debug('visiting root');
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/account/register', async (req, res) => {
  debug('registering an account');
  accounts
    .validateRegister(req.body)
    .then((data) => {
      accounts
        .registerAccount(data)
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
  debug('login with an account');
  accounts
    .validateLogin(req.body)
    .then((data) => {
      accounts
        .verifyAccount(data)
        .then((result) => {
          debug(result);
          jwt.sign(req.body, SECRET, { expiresIn: '1h', algorithm: 'HS256' }, (err, token) => {
            if (err) {
              res.status(404).json({
                message: err,
              });
            } else {
              res.json({
                token: token,
              });
            }
          });
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

app.post('/account/validate', async (req, res) => {
  debug('validate a token');
  accounts
    .validateToken(req.body)
    .then((token) => {
      jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
          res.status(404).json({
            message: err,
          });
        } else {
          res.json({ token: token });
        }
      });
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
