'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let saltRounds = 10;
let Counter = require('./Counter');
let userSchema = new Schema({
    id: String,
    name : String,
    email: String,
    password: String
});

userSchema.pre('save', function(next) {
	let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(this.password, salt);
    let doc = this;
    Counter.findByIdAndUpdate({_id: 'userId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.id = counter.seq;
        doc.password = hash;
        next();
    });


	
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