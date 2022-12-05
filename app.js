const express = require ('express');
const app = express();
const dotenv = require ('dotenv').config();
const winston = require ('winston');
const error = require ('./middleware/error');
const mongoose = require('mongoose');
const Joi = require ('joi');
//const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const port = process.env.PORT;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ]
  });
//middleware addition. whenever a request hits the backend,
//Express will execute the functions passed to app.use() in order.
app.use(express.json()); //parses incoming JSON requests. populates req.body
app.use('/api/genres', genres);//delegation of the endpoints of the route handlers
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use(error);

//server
app.listen(port, () => {
    console.log(`Listening on ${port}`);
})

//mongoDB connection
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@firstcluster.inftsar.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
async function connect() {
    try {
    await mongoose.connect(uri)
    .then(()=>console.log('Connected in MongoDB'));
    }
    catch (error) {
        console.log(error);
    }
}

connect();

app.get (('/'), async (req,res) => {
    let response = "Welcome to Vidly"
    res.status(200).send(response);
    });