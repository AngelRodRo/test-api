'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('./User');
let Counter = require('./Counter');

let messageSchema = new Schema({
    id: Number,
    from: String,
    to: String,
    contents: String,
    lang: String,
    open: {
        type:Boolean,
        default:true
    },
    userId: { type:Schema.Types.ObjectId, ref:'User' }
});

messageSchema.pre('save', function(next) {
    let doc = this;
    Counter.findByIdAndUpdate({_id: 'messageId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.id = counter.seq;
        next();
    });
});

messageSchema.statics.createMessageFromUser = function(userId,data){
    let promise = User.findOne({id:userId}).exec();

    return promise
        .then((user)=> {
            data.from = user.name;
            return this.create(data);
        });
}

messageSchema.statics.listMySentMessages = function(userId){
    let promise = this.find({_id:userId}).exec();
    return promise;
}

// TODO: Add validation for user if it isn't his message
messageSchema.statics.updateMessageFromUser = function(userId,id,data){
    let promise = User.findOne({_id:userId}).exec();
    let model = this;   

    return promise  
        .then((user)=> {
            
        return model.findOneAndUpdate({id:id },data).exec()
        
        }).catch((err)=>{
            console.log(err)
        })

}

// TODO: Add validation for user if it isn't his message
messageSchema.statics.deleteMessageFromUser = function(id,userId){
    let promise = User.findOne({_id:userId}).exec();
    
    return promise
            .then((user)=> this.remove({id:id}));

}

//TODO: Make tests for this
messageSchema.statics.receiveMessages = function(id){

    let promise = User.findOne({id:id}).exec();
    return promise.then((user)=>{
        if(!user) throw 'No exist an user with this Id';
        this.find({to:user.name}).exec()
    });
}

//TODO: Make tests for this
messageSchema.statics.sentMessages = function(id){

    let promise = User.findOne({id:id}).exec();
    return promise.then((user)=>{
        if(!user) throw 'No exist an user with this Id';
        this.find({from:user.name}).exec()
    });
}

messageSchema.statics.getMessagesForLanguage = function(lang){
    let promise = this.find({lang:lang}).exec();
    return promise;
}

module.exports = mongoose.model('Message',messageSchema);