const uuid = require('uuid')
const Bank = require('./Bank');
const Accounts = require('./Accounts');
const Credentials = require('./credentials');
const bcrypt = require('bcrypt');


class Customer{
    static customerID = 3000;
    static allCustomers = []
 constructor(firstName,lastName,credential,role) {
     this.customerID = Customer.customerID++
     this.firstName = firstName
     this.lastName = lastName
     this.role = role
     this.credential = credential
     this.isActive = true
     this.accounts = []
     this.totalBalance = 0
 }
 
    getAllCustomers(){
    if(Customer.allCustomers.length == 0){
        return [false,-1]
    }
    return [true,Customer.allCustomers]
    }

 async comparePassword(password)
 {
     let passwordMatch = await bcrypt.compare(password,this.credential.password);
     return passwordMatch;
 }



 findBankAccount(bankAbbreviation){
  for (let index = 0; index < this.accounts.length; index++) {
     const currentAccount = this.accounts[index];
     if(currentAccount.bankAbbreviation == bankAbbreviation){
         return [true,index]
     }
  }
  return [false,null]
 }

 static findUserName(userName){
    for (let index = 0; index < Customer.allCustomers.length; index++) {
        if(Customer.allCustomers[index].credential.userName == userName){
            return [true,index]
        }
     }
     return [false,-1]
}


 
 updateTotalBalance(){
     let TemporaryBalance = 0;
     this.accounts.forEach(account => {
         TemporaryBalance = TemporaryBalance +  account.balance
     });
 
     this.totalBalance = TemporaryBalance
 }
 
 createNewBankAccount(bankAbbreviation){
     let [message] = Bank.findBank(bankAbbreviation)
     if(!message){
         console.log(`Bank with the name ${bankAbbreviation} doesn't Exists!!!`);
         return [false,"Bank doesn't Exists!!!"]
     }
     let [check,index]= this.findBankAccount(bankAbbreviation)
     if(check){
         console.log(`Bank Account in ${bankAbbreviation} Already Exists!!!`);
         return [false,"Bank Account Already Exists!!!"]
     }
 
     let newCustomerAccount = Accounts.createNewAccount(bankAbbreviation)
     this.accounts.push(newCustomerAccount)
     this.updateTotalBalance()
     return [true,"Bank Account Created!!"]
 } 
 static async createAdmin(){
    let [credentialSuccess,newCredential] = Credentials.createCredential('GR123','GR@2000')
    newCredential.password = await newCredential.getHashPassword()
    let newCustomer = new Customer('George','Russell',newCredential,'admin')
    Customer.allCustomers.push(newCustomer)
    return [true,newCustomer];
}

  async createNewCustomer(firstName,lastName,userName,password){
       let [credentialSuccess,newCredential] =  Credentials.createCredential(userName,password)
       if(!credentialSuccess)
       {
        return [false,null]
       }
       newCredential.password = await newCredential.getHashPassword()
       let newCustomer = new Customer(firstName,lastName,newCredential,'user');
       Customer.allCustomers.push(newCustomer)
       return [true,newCustomer];
 }
 
 deposit(bankAbbreviation,depositMoney){
 
     let [message,index] = this.findBankAccount(bankAbbreviation)
     if(!message){
        return [false,"No Bank Named "+ bankAbbreviation]
    }

     if(message && depositMoney > 0){
         this.accounts[index].updateBalance(depositMoney)
         this.updateTotalBalance()
         return [true,"Deposit Successful"]
     }
     return [false,"Amount Should Be Greater than 0"]
 
 }
 
 withdraw(bankAbbreviation,withdrawMoney){
     let [message,index] = this.findBankAccount(bankAbbreviation)
     if(!message){
         return [false,"Bank Doesn't Exists!!!"]
     }
 
     if(message && this.accounts[index].balance >= withdrawMoney){
         this.accounts[index].updateBalance(-withdrawMoney)
         this.updateTotalBalance()
         return [true,"Withdraw Successful"]
     }
 
     return [false,"Low Balance In The Account!!!"]
 
 }
 
 transfer(debitBankAbbr,creditBankAbbr,amount,userName){
 
 let [BankCheck] = Bank.findBank(creditBankAbbr)
 if(!BankCheck){
     return 
 }
 
 let [message , CustomerIndex] = Customer.findUserName(userName)
 if(!message){
     return
 }
 
 let customer = Customer.allCustomers[CustomerIndex]
 let [status,accountIndex] = customer.findBankAccount(creditBankAbbr)
 
 let [withdrawCheck] = this.withdraw(debitBankAbbr,amount)
 if(!withdrawCheck)
 {
     return
 }
 this.updateTotalBalance()
 customer.accounts[accountIndex].updateBalance(amount)
 customer.updateTotalBalance()
 
 }

 transferByID(debitBankAbbr,creditBankAbbr,amount,userName){

    let [message , CustomerIndex] = Customer.findUserName(userName)
    if(!message){
        return [false,"Credit Customer doesn't Exist!!!"]
    }

    let [BankCheckCredit] = Bank.findBank(creditBankAbbr)
    if(!BankCheckCredit){
        return [false,"Credit Bank doesn't Exist!!!"]
    }

    let [BankCheckDebit] = Bank.findBank(debitBankAbbr)
    if(!BankCheckDebit){
        return [false,"Debit Bank doesn't Exist!!!"]
    }

    let customer = Customer.allCustomers[CustomerIndex]
    let [status,accountIndex] = customer.findBankAccount(creditBankAbbr)
    if(!status){
        return [false,"Credit Customer doesn't have account in Bank"]
    }
    
    let [WithdrawSuccess,text] = this.withdraw(debitBankAbbr,amount)
    if(!WithdrawSuccess)
    {
        return [false,text]
    }

    this.updateTotalBalance()
    customer.accounts[accountIndex].updateBalance(amount)
    customer.updateTotalBalance()
    return [WithdrawSuccess,text]
    }
 
    selfTransfer(debitBankAbbr,creditBankAbbr,amount){
    this.transfer(debitBankAbbr,creditBankAbbr,amount,this)
 }
 
 }
 
 module.exports = Customer;