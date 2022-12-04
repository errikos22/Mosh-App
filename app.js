const express = require ('express');
const dotenv = require ('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const port = process.env.PORT;

//middleware addition. whenever a request hits the backend,
//Express will execute the functions passed to app.use() in order.
app.use(express.json()); //parses incoming JSON requests. populates req.body
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);

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