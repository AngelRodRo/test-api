let models = require('../../index'),
    messages = require('../seeds/messages'),
    Message = models.Message,
    generator = require('../helpers/iterator');

let users = ["Albert","Luis","Alfred","David","Eduard"];
messages = messages.map((message)=>{

    let rand = Math.floor(Math.random() * 4) + 0;
    message.to = users[Math.floor(Math.random() * 4) + 0];
    message.from = users[Math.floor(Math.random() * rand) + 0];
    return message;
})

module.exports = generator(messages,Message,'MESSAGE');
