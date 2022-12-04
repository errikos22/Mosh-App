const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const {Movie,validate} = require('../models/movie')
const {Genre} = require('../models/genre')
const router = express.Router();

router.get (('/'), async (req,res) => {
let response = await Movie.find().sort('name');
res.status(200).send(response);
});
router.get(('/:id'), async (req,res)=> {
    try {
    let movie = await Movie.findById(req.params.id);
    if (movie) res.status(200).send(movie);
    if (!movie) res.status(404).send('Cannot Get. Requested Movie Not Found');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post(('/'), async (req,res)=> {
    let {error} = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');
    let movie = new Movie ({
        title:req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    let response  = await movie.save();
    res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});
router.put(('/:id'), async (req,res)=> {
    let {error} = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');
    let movie = await Movie.findByIdAndUpdate(req.params.id, 
        { 
            title: req.body.title,
            genre: {
              _id: genre._id,
              name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
          }, { new: true });
    if (movie) res.status(200).send(movie);
    if (!movie) res.status(404).send('Cannot Update. Requested Movie Not Found.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});
router.delete(('/:id'), async (req,res)=> {
    try {
    let movie = await Movie.findByIdAndRemove(req.params.id);
    if (movie) res.status(200).send(movie);
    if (!movie) res.status(404).send('Cannot Delete. Requested Movie Not Found');
} catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
}});
module.exports=router;