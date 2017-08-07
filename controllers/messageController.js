'use strict';
let Message = require('../models/Message'),
     User = require('../models/User');
module.exports = {


    create(req,res){

        let userId = req.body.userId ;
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
                console.log(error);
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
        var userId 
    },

    sent(req,res){

    }


}