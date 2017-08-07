'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('./User');


let messageSchema = new Schema({
    id: Number,
    from: String,
    to: String,
    contents: String,
    lang: String,
    open: Boolean,
    userId: { type:Schema.Types.ObjectId, ref:'User' }
});

messageSchema.pre('save', function(next) {
    this.constructor.count({},(err,c)=>{
        this.id = c + 1;
    	return next();
    });
});

messageSchema.statics.createMessageFromUser = function(userId,data){
    let promise = User.findOne({name:"user"}).exec();

    return promise
        .then((user)=> {
            data.from = user.name;
            return this.create(data);
        })
        .catch((err)=>{

        })
}

messageSchema.statics.listMySentMessages = function(userId){
    let promise = this.find({_id:userId}).exec();
    return promise;
}


module.exports = mongoose.model('Message',messageSchema);