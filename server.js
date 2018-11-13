
'use strict';

// Load array of notes
const data = require('./db/notes');

const simDB = require('./db/simDB');  // <<== add this

const notes = simDB.initialize(data); // <<== and this

const logger = require('./middleware/logger')

const { PORT } = require('./config');

const express = require('express');

const app = express();

// ADD STATIC SERVER HERE
app.use(logger);
app.use(express.static('public'));
app.use(express.json());

app.get('/api/notes/:id', (req, res) => {
    const id  = Number(req.params.id)
    console.log(id);
    notes.find(id, (err, list) => {
        if (err) {
            return next(err); // goes to error handler
          }
          res.json(list); // responds with filtered array
    })
});

 // http://localhost:8080/api/notes?searchTerm=cats
  //http://localhost:8080/api/notes/:searchTerm

  app.get('/api/notes', (req, res, next) => {
    const { searchTerm } = req.query;
    notes.filter(searchTerm, (err, list) => {
      if (err) {
        return next(err); // goes to error handler
      }
      res.json(list); // responds with filtered array
    });
  });

  app.put('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;
    console.log(req.body)
    /***** Never trust users - validate input *****/
    const updateObj = {};
    const updateFields = ['title', 'content'];
  
    updateFields.forEach(field => {
      if (field in req.body) {
        updateObj[field] = req.body[field];
      }
    });
  
    notes.update(id, updateObj, (err, item) => {
        console.log(updateObj)
        if (err) {
        return next(err);
      }
      if (item) {
        res.json(item);
      } else {
        next();
      }
    });
  });

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
