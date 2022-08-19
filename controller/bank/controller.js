const Bank = require('../../model/Bank')
const Joi = require('joi')
const JWTPayload = require('../../model/authentication');
function createbank(req,resp,admin){
    // const schema = Joi.object({
    //     bankName : Joi.string().min(3).required(),
    //     bankAbbreviation  : Joi.string().min(3).required()
    // })
    // const {error,val} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }

    const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    if(!isValidAdmin){
        return
    }

    const {bankName,bankAbbreviation} = req.body;
    let [success,newBank] = Bank.createNewBank(bankName,bankAbbreviation)
    if(!success){
        resp.status(400).send("Bank Already Exists!!!")
        return
    }
    console.log(newBank);
    resp.status(200).send("Bank Created Successfully")
    return
}

function getallBanks(req,resp,admin){

    // const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    // if(!isValidAdmin){
    //     return;
    // }
    
    let [success,allBanks] = Bank.getAllBanks()
    if(!success){
        resp.status(400).send("No Banks")
        return
    }
    resp.status(200).send(allBanks)
    return
}
module.exports = {createbank,getallBanks};