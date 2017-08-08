var models = require('../../index');

var Counter = models.Counter;

module.exports = function(){
        return Promise.all(
            [
                Counter.create({_id:"userId",seq:1}),
                Counter.create({_id:"messageId",seq:1})
            ]
        );
}()
