'use strict';
let Message = require('../models/Message'),
    request = require('request'),
    config = require('../config/config.json'),
    User = require('../models/User');
     
module.exports = {

    create(req,res){
            let userId = req.headers.user.id,
                {name, contents,lang,to} = req.body,
                error = {}

            if(!contents) {
                error.message = "Ocurred an error while creating, you need put the content before continue";
                error.code = "41001";
                return res.status(503).send(error);
            }
            if(!lang) {
                error.message = "Ocurred an error while registering, you need put the lang before continue";
                error.code = "41002";
                return res.status(503).send(error);
            }

            if(!to){
                error.message = "Ocurred an error while registering, you need put the destinatary before continue";
                error.code = "41003";
                return res.status(503).send(error);
            }

            Message.createMessageFromUser(userId,{
                contents:contents,
                lang:lang,
                to:to
            }).then((message)=>{
                return res.json(message);
            }).catch((err)=>{
                error.message = "Check the details for more information";
                error.details = err.toString();
                return res.status(503).send(error);
            });




    },

    update(req,res){
        let userId = req.headers.user.id,
            id = req.params.id,
            {contents,lang} = req.body;

        let data = {
            contents:contents,
            lang:lang
        }
        
        let error = {};


        Message.updateMessageFromUser(userId,id,data)
            .then((message)=>{
                if(message){
                    
                    message.contents = contents;
                    message.lang = lang;
                    return res.json(message);
                }
                error.message = "No exist the message";
                return res.status(503).send(error)
            }).catch((err)=>{
                error.message = "Check the details for more information";
                error.details = err.toString();
                return res.status(503).send(error);
            })
    },

    getOne(req,res){
        var id = req.params.id;
        let error = {}

        Message.findOne({id:id}).exec().then((message)=>{
            return res.json(message)
        }).catch((err)=>{
            error.message = "Check details for more information";
            error.details = err.toString();
            return res.status(503).send(err);            
        })
    },

    getAll(req,res){
        let promise =  Message.find({}).exec();
        let error = {}
        promise.then((messages)=>{
            return res.json(messages)
        }).catch((err)=>{
            error.message = "Check details for more information";
            error.details = err.toString();
            return res.status(503).send(err);
        })
    },

    delete(req,res){

        let id = req.params.id;
        let userId = req.headers.user.id;

        Message.deleteMessageFromUser(id,userId)
            .then(()=>{
                let message = "Message deleted successfully!"
                return res.status(200).send(message);
            }).catch((err)=>{
                let error = {};
                error.message = "Check the details for more information";
                error.details = err;
                return res.status(503).send(error);
            })
    },
    receive(req,res){

        let userId = req.headers.user.id,
            error = {};

        Message.receiveMessages(userId)
            .then((messages)=>{
                if(!messages){
                    error.message = "You don't have receive messages !";
                    return res.status(503).send(error)
                }
                return res.json(messages);
            }).catch((err)=>{
                error.message = "Ocurred an error, check the details for more information";
                error.details = err.toString();
                return res.status(503).send(error)

            })
    },

    translate(req,res){

        let tLang = req.params.lang,
            messageId = req.params.id,
            error = {}
        Message.translateMessage(messageId,tLang)
            .then((response)=>{
                return res.status(200).send(response);
            })    
            .catch((err)=>{
                error.message = "Ocurred an error, check the details for more information";
                error.details = err.message;
                return res.status(503).send(error);
            })
    },

    getMessagesForLanguage(req,res){
        let lang = req.params.lang,
            error = {};

        Message.getMessagesForLanguage(lang)
            .then((messages)=>{
                let count = messages.length;
                let objects = messages;

                let data = { count, objects};
                return res.json(data);
            })
            .catch((error)=>{
                error.message = "Ocurred an error, check the details for more information";
                error.details = err.toString();
                return res.status(503).send(error);
            })
    },
    

    sent(req,res){

        let userId = req.headers.user.id,
            error = {}

        Message.sentMessages(userId)
            .then((messages)=>{
                if(!messages){
                    error.message = "You don't have sent messages !";
                    return res.status(503).send(error)
                }
                return res.json(messages);
            }).catch((err)=>{
                error.message = "Ocurred an error, check the details for more information";
                error.details = err.toString();
                return res.status(503).send(error)

            })
    }


}