const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

const {createbankaccount} = require("./controller/account/controller")
const {createbank,getallBanks} = require("./controller/bank/controller")
const {CreateCustomer,getallcustomers,deposit,withdraw,transfer,selftransfer} = require("./controller/customer/controller")
const {login} = require("./controller/login/controller")
const {logout} = require("./controller/logout/controller")
const Customer = require('./model/Customer')

let admin = null
let message = null

async function  createadmin(){
      [message,admin] = await Customer.createAdmin()
}

app.post("/api/login",async (req,resp)=>login(req,resp))

app.post("/api/createbank",(req,resp)=>createbank(req,resp,admin))

app.post("/api/CreateCustomer",async (req,resp)=>CreateCustomer(req,resp,admin))

app.get("/api/getallbanks",(req,resp)=>getallBanks(req,resp,admin))

app.get("/api/getallcustomers",(req,resp)=>getallcustomers(req,resp,admin))

app.post("/api/createbankaccount",(req,resp)=>createbankaccount(req,resp,admin))

app.post("/api/deposit",(req,resp)=>deposit(req,resp))

app.post("/api/withdraw",(req,resp)=>withdraw(req,resp))

app.post("/api/transfer",(req,resp)=>transfer(req,resp))

app.post("/api/selftransfer",(req,resp)=>selftransfer(req,resp))

app.post("/api/logout",(req,resp)=>logout(req,resp))

app.listen(8080,()=>{
    console.log("app is started at port 8080")
    createadmin()
})
