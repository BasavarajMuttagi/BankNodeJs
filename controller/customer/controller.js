const Customer = require('../../model/Customer')
const JWTPayload = require('../../model/authentication');
const Joi = require('joi')
async function CreateCustomer(req,resp,admin){
    const schema = Joi.object({  
        firstName : Joi.string().min(3).required(),
        lastName  : Joi.string().min(3).required(),
        userName  : Joi.string().min(3).alphanum().required(),
        password  : Joi.string().min(3).required()
    })
    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
    const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    if(!isValidAdmin){
        return;
    }

    const {firstName,lastName,userName,password} = req.body
    let [success,newCustomer] = await admin.createNewCustomer(firstName,lastName,userName,password)
    if(!success){
        resp.status(400).send("Customer Exists")
        return
    }
    console.log(newCustomer);
    resp.status(200).send("Customer Created!!!")
    return 
}

function getallcustomers(req,resp,admin){
    const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    if(!isValidAdmin){
        return;
    }
    
    let [success,allCustomers] = admin.getAllCustomers()

    if(!success){
        resp.status(400).send("No Customers")
        return
    }
    resp.status(200).send(allCustomers)
    return
}

function deposit(req,resp){
   
        let {userName,bankAbbreviation,amount} = req.body
        const schema = Joi.object({  
            userName  : Joi.string().min(3).alphanum().required(),
            bankAbbreviation  : Joi.string().min(3).required(),
            amount  : Joi.string().min(1).required()
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
            resp.status(400).send("Not a Customer")
            return 
        }
        
        let [DepositSuccess,text] = Customer.allCustomers[index].deposit(bankAbbreviation,amount)
            if(!DepositSuccess){
                resp.status(400).send(text)
                return 
            }
            resp.status(200).send(text)
            
}

function withdraw(req,resp){
        let {userName,bankAbbreviation,amount} = req.body
        const schema = Joi.object({  
            userName  : Joi.string().min(3).alphanum().required(),
            bankAbbreviation  : Joi.string().min(3).required(),
            amount  : Joi.string().min(1).required()
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
            resp.status(400).send("Not a Customer")
            return 
        }
        
        let [WithdrawSuccess,text] = Customer.allCustomers[index].withdraw(bankAbbreviation,amount)
            if(!WithdrawSuccess){
                resp.status(400).send(text)
                return 
            }
            resp.status(200).send(text)
            
}

function transfer(req,resp){
    let {usernameOfSender,usernameOfReceiver,bankAbbreviationSender,bankAbbreviationReceiver,amount} = req.body
    const schema = Joi.object({  
        usernameOfSender  : Joi.string().min(3).alphanum().required(),
        usernameOfReceiver  : Joi.string().min(3).alphanum().required(),
        bankAbbreviationSender  : Joi.string().min(3).required(),
        bankAbbreviationReceiver  : Joi.string().min(3).required(),
        amount  : Joi.string().min(1).required()
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

    let [usernameOfSenderSuccess,indexOfSender] = Customer.findUserName(usernameOfSender)
    if(!usernameOfSenderSuccess){
        resp.status(400).send("Sender is Not a Customer")
        return 
    }
    let [status,accountIndex] = Customer.allCustomers[indexOfSender].findBankAccount(bankAbbreviationSender)
    if(!status){
        return [false,"Debit Customer doesn't have account in Bank"]
    }

 let [transferSuccess,text] = Customer.allCustomers[indexOfSender].transferByID(bankAbbreviationSender,bankAbbreviationReceiver,amount,usernameOfReceiver)
    if(!transferSuccess){
        resp.status(400).send(text)
        return
    }
    resp.status(200).send(text)
}

function selftransfer(req,resp){
    let {userName,bankAbbreviationSender,bankAbbreviationReceiver,amount} = req.body
    const schema = Joi.object({  
        userName  : Joi.string().min(3).alphanum().required(),
        bankAbbreviationSender  : Joi.string().min(3).required(),
        bankAbbreviationReceiver  : Joi.string().min(3).required(),
        amount  : Joi.string().min(1).required()
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
    let [userNameSuccess,indexOfCustomer] = Customer.findUserName(userName)
    if(!userNameSuccess){
        resp.status(400).send("Not a Customer")
        return 
    }
    let [status,accountIndex] = Customer.allCustomers[indexOfCustomer].findBankAccount(bankAbbreviationSender)
    if(!status){
        return [false,"Customer doesn't have account in Bank"]
    }

 let [transferSuccess,text] = Customer.allCustomers[indexOfCustomer].transferByID(bankAbbreviationSender,bankAbbreviationReceiver,amount,userName)
    if(!transferSuccess){
        resp.status(400).send(text)
        return
    }
    resp.status(200).send(text)
}



module.exports =  {CreateCustomer,getallcustomers,deposit,withdraw,transfer,selftransfer};