'use strict';
let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./User'),
    Counter = require('./Counter'),
    dateHelper = require('../helpers/dates'),
    request = require('request'),
    config = require('../config/config.json');

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
    userId: { type:Schema.Types.ObjectId, ref:'User' },
    createdAt:{
        type:Date,
        default: new Date()
    }
});

//Pre hook for check if the user is available send a messages in an hour
messageSchema.pre('save', function(next) {
    let {start,end} =  dateHelper.getIntervalsFromTodayinHours();
    
    this.constructor.count({
        createdAt: { $gte: start, $lte: end },
        from: this.from
    },(err,count)=>{
        if(count<=process.env.limit) return next();
        let error = new Error('Limit of messages exceed, wait an hour please');
        next(error);
    })
});

// Pre hook for create a autoincrement id for this model
messageSchema.pre('save', function(next){
    let doc = this;
    Counter.findByIdAndUpdate({_id: 'messageId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        if(counter) doc.id = counter.seq;
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


messageSchema.statics.updateMessageFromUser = function(userId,id,data){
    let promise = User.findOne({id:userId}).exec();
    let model = this;   

    return promise  
        .then((user)=> { 
            return model.findOneAndUpdate({id:id },data).exec()
        })

}

messageSchema.statics.deleteMessageFromUser = function(id,userId){
    let promise = User.findOne({id:userId}).exec();
    
    return promise
            .then((user)=>{
                return this.remove({id:id,from:user.name})
            });

}

messageSchema.statics.receiveMessages = function(id){

    let promise = User.findOne({id:id}).exec();
    return promise.then((user)=>{
        if(!user) throw 'No exist an user with this Id';
        return this.find({to:user.name}).exec()
    });
}

messageSchema.statics.sentMessages = function(id){

    let promise = User.findOne({id:id}).exec();
    let model = this;
    return promise.then((user)=>{
        if(!user) throw 'No exist an user with this Id';
        return this.find({from:user.name}).exec()
    });
}

// Translate using Yandex API using the following scheme "es-en" i.e. from Spanish to English
messageSchema.statics.translateMessage = function(id,tLang){

    return this.findOne({id:id}).exec().then((message)=>{
            let fLang = message.lang;
            let lang = fLang + "-" + tLang;

            let url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${config.yandexAPIKEY}&text=${message.contents}&lang=${lang}`;
            return new Promise((resolve,reject)=>{
                request(url,function(err,response,body){
                    if(err) return reject(err);
                    let data = JSON.parse(body);
                    if(data.code!==200) return reject(data);
                    let translate = data.text[0];
                    let resp = {message,translate}
                    
                    return resolve(resp);
                })
            });  
        })
        
}

messageSchema.statics.getMessagesForLanguage = function(lang){
    let promise = this.find({lang:lang}).exec();
    return promise;
}

module.exports = mongoose.model('Message',messageSchema);