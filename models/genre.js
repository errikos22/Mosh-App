const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name : String
});
const Genre = new mongoose.model('genre',genreSchema);

function validateGenre (input) {
    const schema = Joi.object ({
        name: Joi.string().min(3).max(100).trim().lowercase().required()
    });
    return (schema.validate ({name : input}, {convert:false}));
}
module.exports.Genre=Genre;
module.exports.validate=validateGenre;