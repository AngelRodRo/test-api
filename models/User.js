'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let saltRounds = 10;

let userSchema = new Schema({
    id: String,
    name : String,
    email: String,
    password: String
});

userSchema.pre('save', function(next) {
	let salt = bcrypt.genSaltSync(saltRounds);
	let hash = bcrypt.hashSync(this.password, salt);
	this.password = hash;
	next();
});

userSchema.statics.login = function(email,password){
    var promise = this.findOne({email:email}).exec();

    promise.then((user)=>{
        var error = {},
            body = {};

        if(err){
            throw err;
        } 
        if(!user){
            throw {err,user}
        } 	

        return bcrypt.compare(password, user.password).then((res)=>{
            let data = {}
            data.user = user;
            if(res){
                data.verified = true;
                return data;
            }
            data.verified = false
            return data ;
        });
    })

    
}

module.exports = mongoose.model('User',userSchema);