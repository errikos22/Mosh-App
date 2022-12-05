const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
  let response = await Rental.find().sort('-dateOut');
  res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
try {
  let { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  let movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  rental = await rental.save();

  movie.numberInStock--;
  movie.save();
  
  res.send(rental);
} catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
}
});

router.get('/:id', async (req, res) => {
    try {
  let rental = await Rental.findById(req.params.id);
  if (rental) res.status(200).send(rental);
  if (!rental) res.status(404).send('Cannot Get. Requested Rental Not Found');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete(('/:id'), async (req,res)=> {
    try {
    let rental = await Rental.findByIdAndRemove(req.params.id);
    if (rental) res.status(200).send(rental);
    if (!rental) res.status(404).send('Cannot Delete. Requested Rental Not Found');
} catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
}});

module.exports = router; 