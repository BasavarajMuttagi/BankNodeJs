const uuid = require('uuid')
const Bank = require('./Bank');

class Accounts{
    static accountNumber = 2000;
    constructor(bankAbbreviation) {
        this.bankAbbreviation = bankAbbreviation
        this.accountNumber = Accounts.accountNumber++;
        this.balance = 1000
    }
    
    updateBalance(balance){
    this.balance +=  parseInt(balance)
    }
    
    static createNewAccount(bankAbbreviation){
        let newAccount = new Accounts(bankAbbreviation);
        return newAccount
    }
    
}

module.exports = Accounts;