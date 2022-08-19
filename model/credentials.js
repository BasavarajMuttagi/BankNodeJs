const bcrypt = require('bcrypt');

class Credentials{
    static credentialId = 0
    static allCredebtials = []
    constructor(userName,password) {
        this.credentialId = Credentials.credentialId++
        this.userName = userName
        this.password = password
    }
    async getHashPassword(){
        return bcrypt.hash(this.password,10);
    }

    static findUser(userName){
        for (let index = 0; index < Credentials.allCredebtials.length; index++) {
            if(Credentials.allCredebtials[index].userName == userName){
                return [true,index]
            }
        }
        return [false,-1]
    }

    static createCredential(userName,password){
        let [isUserNameExist] = Credentials.findUser(userName)
         if(isUserNameExist){
             return [false,null]
         }
         let newcredential = new Credentials(userName,password)
         Credentials.allCredebtials.push(newcredential)
         return [true,newcredential]
     }
}

module.exports = Credentials;