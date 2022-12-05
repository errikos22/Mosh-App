const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

const movieSchema = new mongoose.Schema({
  title : {
    type: String,
    required: true,
  },
  genre: { 
    type: genreSchema,  
    required: true
  },
  numberInStock : {
    type: Number,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    required: true
  }
})
const Movie = new mongoose.model('movie', movieSchema);

function validateMovie(movie) {
  const schema = Joi.object ({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  });
  let result= (schema.validate (movie, {convert:false}));
  console.log(result);
  return result;
}

exports.Movie = Movie; 
exports.validate = validateMovie;