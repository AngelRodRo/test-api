'use strict'
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let chaiAsPromised = require('chai-as-promised');
let mongoose = require('mongoose');

chai.use(chaiAsPromised);
chai.use(chaiHttp);
let should = chai.should();
let Message = require('../models/Message');

describe('Message',()=>{

    beforeEach(function(done){
        mongoose.Promise = global.Promise;

        mongoose.connect('mongodb://localhost/testmetro',()=>{
            done()
        });
    })

    beforeEach((done)=>{
        Message.remove({},()=>{
            done();
        })
    })

    describe('Init functions',()=>{

        it('it should be a function',(done)=>{
            expect(Message.createMessageFromUser).to.be.a('Function');
            // expect(Message.deleteMessageFromUser).to.be.a('Function');
            // expect(Message.updateMessageFromUser).to.be.a('Function');

            // expect(Message.listMySentMessages).to.be.a('Function');
            // expect(Message.listMyReceiveMessage).to.be.a('Function')
            
            // expect(Message.translateMessage).to.be.a('Function');
            // expect(Message.listMessagesForLanguage).to.be.a('Function');

            done();
        })

    })

    describe('Operations',()=>{
        it('it should CREATE new message',()=>{
            let data = {            
                to:"Alvaro",
                contents:"hola amigo Alvaro",
                lang:"es",
                open:true
            };

            return Message.createMessageFromUser("598896a4e89d4546a158fa65",data).then((message)=>message._doc).should.eventually.have.all.keys('__v','_id','id','to','from','open', 'contents','lang');

        })
    })

    describe('API REQUEST',()=>{
        it('it should CREATE a new message with user id',()=>{
            
        })
    })

})