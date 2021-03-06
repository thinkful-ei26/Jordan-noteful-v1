'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB'); 
const notes = simDB.initialize(data);
const express = require('express');
const router = express.Router(); 

 
router.get('/notes/:id', (req, res) => {
    const id  = Number(req.params.id)
    console.log(id);
    notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err)
    });
});

router.get('/notes', (req, res, next) => {
const { searchTerm } = req.query;
console.log(searchTerm)
console.log(`it's running`)
notes.filter(searchTerm)
    .then(item => {
      console.log(item)
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err)
      console.log(err)
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
    if (!updateObj.title) {
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }
  
    notes.update(id, updateObj)
      .then(item => {
        if (item) {
          res.json(item);
        } else {
          next();
        }
      })
      .catch(err => next(err));
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

    notes.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err)
    });
});

router.delete('/notes/:id', (req, res) => {
    const id = req.params.id;

notes.delete(id)
    .then(item => {
      if (item) {
        console.log(`No Content: ${id}`);
        res.status(204).end()
      } else {
        res.status(500).end()
      }
    })
    .catch(err => {
      next(err)
    });
});  

module.exports = router;

//success next with error next with nothing