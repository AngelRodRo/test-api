'use strict';
let Message = require('../models/Message'),
    request = require('request'),
    config = require('../config/config.json'),
     User = require('../models/User');
module.exports = {


    create(req,res){

        var userId = req.body.userId || req.headers.id ||  req.headers.user.id;
        let {name, contents,lang,to} = req.body;
        let error = {}

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
        let userId = "598896a4e89d4546a158fa65";
        let id = req.params.id;
        let {contents,lang} = req.body;

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

    },

    delete(req,res){

        var id = req.params.id;

        Message.deleteMessageFromUser(id)
            .then(()=>{
                return res.status(200).send();
            }).catch((err)=>{
                let error = {};
                error.message = "Check the details for more information";
                error.details = err;
                return res.status(503).send(error);
            })
    },
    receive(req,res){
        var userId = req.body.userId || req.headers.id ||  req.query.userId;
        let error = {}
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

        let tLang = req.params.lang;
        let text = "dsadsa";
        let messageId = req.params.id;

        let error = {}

        Message.findOne({id:messageId}).exec().then((message)=>{
            let fLang = message.lang;
            let lang = fLang + "-" + tLang;

            let url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${config.yandexAPIKEY}&text=${message.contents}&lang=${lang}`;
            request(url,(err,response,body)=>{
                let data = JSON.parse(body);
                let translate = data.text[0];
                let resp = {message,translate}
                return res.json(resp);
            })
        })
        .catch((err)=>{
            error.message = "Ocurred an error, check the details for more information";
            error.details = err.toString();
            return res.status(503).send(error);
        })
    },

    getMessagesForLanguage(req,res){

        let lang = req.params.lang;
        let error = {};
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
        var userId = req.body.userId || req.headers.id || req.query.userId;
        let error = {}
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