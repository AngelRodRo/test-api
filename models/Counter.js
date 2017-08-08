'use strict'
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

let Counter =  mongoose.model('Counter', CounterSchema);

Counter.findOne({_id:'messageId'},function(err,counter){
    if(!counter){
        counter = new Counter();
        counter._id = "messageId";
        counter.save();
    }
})

Counter.findOne({_id:'userId'},function(err,counter){
    if(!counter){
        counter = new Counter();
        counter._id = "userId";
        counter.save();
    }
});


module.exports = Counter;
