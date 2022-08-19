const uuid = require('uuid')

class Bank{
    static bankID = 1000;
    static allBanks = []
 constructor(bankName,bankAbbreviation) {
     this.bankID = Bank.bankID++
     this.bankName = bankName
     this.bankAbbreviation = bankAbbreviation
 }
 
 static createNewBank(bankName,bankAbbreviation){
         for (let index = 0; index < Bank.allBanks.length; index++) {
             if(Bank.allBanks[index].bankName == bankName || Bank.allBanks[index].bankAbbreviation == bankAbbreviation){
                 console.log(`Bank with the name ${bankAbbreviation} Already Exists!!!`);
                 return [false,-1]
             }
         }
         let  newBank = new Bank(bankName,bankAbbreviation);
         Bank.allBanks.push(newBank);
         return [true,newBank]
 }
 
 
 static findBank(bankAbbreviation){
     for (let index = 0; index < Bank.allBanks.length; index++) {
         const currentBank = Bank.allBanks[index];
         if(currentBank.bankAbbreviation == bankAbbreviation){
             return [true]
         }
     }
     return [false]
 }

 static getAllBanks(){
    if(Bank.allBanks.length == 0){
        return [false,-1]
    }
    return [true,Bank.allBanks]
 }
 
 }
 
 module.exports = Bank;