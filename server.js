
'use strict';

// Load array of notes
const express = require('express');

const data = require('./db/notes');

const { PORT } = require('./config');

const app = express();

// ADD STATIC SERVER HERE
app.use(express.static('public'));


app.get('/api/notes/:id', (req, res) => {
    //let's us use numbers 
    const id = Number(req.params.id);
    //finds item by ID
    const bookmark = data.find(item => item.id === id);

    res.json(bookmark);
});


 // http://localhost:8080/api/notes?searchTerm=cats
  //http://localhost:8080/api/notes/:searchTerm

app.get('/api/notes', (req, res) => {
    //lets us retrieve the searchTerm from the query.string on req.query object
    const searchTerm = req.query.searchTerm;
    console.log(searchTerm);
    //filter through the array from searchterm and return results
    if (searchTerm) {
        let filtered = data.filter(item => item.title.includes(searchTerm));
        res.json(filtered);
    } else {
        res.json(data);
    }
});

app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
