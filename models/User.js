'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let userSchema = new Schema({
    id: String,
    name : String,
    email: String,
    password: String
});


userSchema.static.login = function(email,password){
}

module.exports = mongoose.model('User',userSchema);