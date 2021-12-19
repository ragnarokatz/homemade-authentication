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

const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (typeof header == 'undefined' || header == null) {
    res.status(403).json({
      message: 'invalid header',
    });
  } else {
    const bearer = header.split(' ');
    const token = bearer[1];

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({
          message: err,
        });
      } else {
        next();
      }
    });
  }
};

app.get('/', (req, res) => {
  debug('visiting root');
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/protected', checkToken, (req, res) => {
  debug('visiting protected route');
  res.sendFile(path.join(__dirname, '/protected.html'));
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
              res.send(token);
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

app.use((req, res) => {
  debug('visiting non existing resource');
  res.status(404).send('Resource not found');
});

module.exports = app;
