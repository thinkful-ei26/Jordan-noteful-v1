'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB'); 
const notes = simDB.initialize(data);
const express = require('express');
const router = express.Router(); 


router.get('/notes/:id', (req, res) => {
    const id  = Number(req.params.id)
    console.log(id);
    notes.find(id, (err, list) => {
        if (err) {
            return next(err); // goes to error handler
          }
          res.json(list); // responds with filtered array
    })
});

router.get('/notes', (req, res, next) => {
const { searchTerm } = req.query;
notes.filter(searchTerm, (err, list) => {
    if (err) {
    return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
});
});

router.put('/notes/:id', (req, res, next) => {
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
});

// Post (insert) an item
router.post('/notes', (req, res, next) => {
    const { title, content } = req.body;
  
    const newItem = { title, content };
    /***** Never trust users - validate input *****/
    if (!newItem.title) {
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }
  
    notes.create(newItem, (err, item) => {
      if (err) {
        return next(err);
      }
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    });
});

router.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    notes.delete(id, (err, note) => {
        if (err) {
            return next(err.status || 500)
        }
        else if (!note) {
            return next("No Content" + err.status || 204)
        }
        res.status(204).end();
    })
})

module.exports = router;