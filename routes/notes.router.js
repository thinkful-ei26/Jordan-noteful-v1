'use strict';

// Load array of notes
const data = require('../db/notes');

const simDB = require('../db/simDB');  // <<== add this

const notes = simDB.initialize(data); // <<== and this

const express = require('express');

const router = express.Router(); 

router.get('/api/notes/:id', (req, res) => {
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

  router.get('/api/notes', (req, res, next) => {
    const { searchTerm } = req.query;
    notes.filter(searchTerm, (err, list) => {
      if (err) {
        return next(err); // goes to error handler
      }
      res.json(list); // responds with filtered array
    });
  });

  router.put('/api/notes/:id', (req, res, next) => {
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

  module.exports = router;
