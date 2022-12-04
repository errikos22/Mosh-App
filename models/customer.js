const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone : {
        type: String,
        required: true
    }
});
const Customer = new mongoose.model('customer',customerSchema);

function validateCustomer (customer) {
    const schema = Joi.object ({
        name: Joi.string().min(5).max(20).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(10).max(10).required().pattern(new RegExp(/^[0-9]*$/))
    });
    let result= (schema.validate (customer, {convert:false}));
    console.log(result);
    return result;
}
module.exports.Customer=Customer;
module.exports.validate=validateCustomer;