'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
    id: Number,
    from: String,
    to: String,
    contents: String,
    lang: String,
    open: Boolean,
    userId: { type:Schema.Types.ObjectId, ref:'User' }
});

module.exports = mongoose.model('Message',messageSchema);