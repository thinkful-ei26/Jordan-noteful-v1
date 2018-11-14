
'use strict';

const logger = require('./middleware/logger')

const { PORT } = require('./config');

const express = require('express');

const notesRouter = require('./routes/notes.router')

const app = express();

// ADD STATIC SERVER HERE
app.use(logger);
app.use(express.static('public'));
app.use(express.json());
app.use(notesRouter);

// app.get('/boom', (req, res, next) => {
//     throw new Error('Boom!!');
//   });

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404).json({ message: 'Not Found' });
  });

  app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
