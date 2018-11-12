
'use strict';

// Load array of notes
const express = require('express');

const data = require('./db/notes');

const app = express();

// const stringData = data.toString();

// ADD STATIC SERVER HERE
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(data);
  });

app.get('/api/notes/:id', (req, res) => {

    const id = Number(req.params.id);
    const bookmark = data.find(item => item.id === id);
    res.json(bookmark);
});

app.listen(8080, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
