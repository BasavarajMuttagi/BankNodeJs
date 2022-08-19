const Customer = require('../../model/Customer')
const JWTPayload = require('../../model/authentication');
const Joi = require('joi')

function createbankaccount(req,resp,admin){
    let {userName,bankAbbreviation} = req.body
    const schema = Joi.object({  
        userName  : Joi.string().min(3).alphanum().required(),
        bankAbbreviation  : Joi.string().min(3).required(),
    })
    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
    
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return;
    }
    
    let [success,index] = Customer.findUserName(userName)
    
    if(!success){
        resp.status(401).send("Not a Customer")
        return 
    }
    
    let [accountCreationSuccess,text] = Customer.allCustomers[index].createNewBankAccount(bankAbbreviation)
        if(!accountCreationSuccess){
            resp.status(400).send(text)
            return 
        }
        resp.status(200).send(text)
    }

    module.exports = {createbankaccount};