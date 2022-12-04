const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const {Customer,validate} = require('../models/customer')
const router = express.Router();

router.get (('/'), async (req,res) => {
let response = await Customer.find().sort('name');
res.status(200).send(response);
});
router.get(('/:id'), async (req,res)=> {
    try {
    let customer = await Customer.findById(req.params.id);
    if (customer) res.status(200).send(customer);
    if (!customer) res.status(404).send('Cannot Get. Requested Customer Not Found');
    } catch (error) {
        console.log(error);
    }
});
router.post(('/'), async (req,res)=> {
    let {error} = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
    let customer = new Customer ({
        name:req.body.name,
        phone:req.body.phone,
        isGold:req.body.isGold});
    let response  = await customer.save();
    res.status(200).send(response);
    } catch (err) {
        console.log(err);
    }
});
router.put(('/:id'), async (req,res)=> {
    let {error} = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
    let customer = await Customer.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
            
        }, {new:true});
    if (customer) res.status(200).send(customer);
    if (!customer) res.status(404).send('Cannot Update. Requested Customer Not Found.');
    } catch (error) {
        console.log(error);
    }
});
router.delete(('/:id'), async (req,res)=> {
    let customer = await Customer.findByIdAndRemove(req.params.id);
    if (customer) res.status(200).send(customer);
    if (!customer) res.status(404).send('Cannot Delete. Requested Customer Not Found');
})
module.exports=router;