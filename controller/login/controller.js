const Customer = require('../../model/Customer');
const JWTPayload = require('../../model/authentication');
const Joi = require('joi')
async function login(req,resp){
    const schema = Joi.object({
        userName : Joi.string().min(3).required(),
        password : Joi.string().min(3).required()
    })
    const {error,val} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
    const {userName,password}= req.body
    let [userExists,index] = Customer.findUserName(userName)
    if(!userExists){
        resp.status(404).send("Wrong Credentials")
        return;
    }
    let passwordsuccess = await Customer.allCustomers[index].comparePassword(password)
    console.log(passwordsuccess);
    if(!userExists || passwordsuccess == false)
    {
        resp.status(404).send("Wrong Credentials")
        return;
    }
    const newPayload = new JWTPayload(Customer.allCustomers[index])
    const newToken = newPayload.createToken();
    resp.cookie("myToken",newToken)
    console.log("Logged in  Successfully");
    resp.status(200).send(Customer.allCustomers[index].role);
}
module.exports = {login};