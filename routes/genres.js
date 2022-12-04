const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const {Genre,validate} = require('../models/genre')
const router = express.Router();

router.get (('/'), async (req,res) => {
let response = await Genre.find().sort('name');
res.status(200).send(response);
});
router.get(('/:id'), async (req,res)=> {
    try {
    let genre = await Genre.findById(req.params.id);
    if (genre) res.status(200).send(genre);
    if (!genre) res.status(404).send('Cannot Get. Requested Genre Not Found');
    } catch (error) {
        console.log(error);
    }
});
router.post(('/'), async (req,res)=> {
    let {error} = validate(req.body.name);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
    let genre = new Genre ({name:req.body.name});
    let response  = await genre.save();
    res.status(200).send(response);
    } catch (err) {
        console.log(err);
    }
});
router.put(('/:id'), async (req,res)=> {
    let {error} = validate(req.body.name);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
    let genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new:true}); //new option returns the updated value (new)
    if (genre) res.status(200).send(genre);
    if (!genre) res.status(404).send('Cannot Update. Requested Genre Not Found.');
    } catch (error) {
        console.log(error);
    }
});
router.delete(('/:id'), async (req,res)=> {
    let genre = await Genre.findByIdAndRemove(req.params.id);
    if (genre) res.status(200).send(genre);
    if (!genre) res.status(404).send('Cannot Delete. Requested Genre Not Found');
})
module.exports=router;