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
let server = require('../index.js');

describe('Message',()=>{

    beforeEach(function(done){
        mongoose.Promise = global.Promise;
        if(mongoose.connection.readyState!=1){

            mongoose.connect('mongodb://localhost/testmetro', { useMongoClient: true } ,()=>{
                done()
            });
        }else{
            done()
        }
    })

    beforeEach((done)=>{
        Message.remove({},()=>{
            done();
        })
    })


    describe('Init functions',()=>{

        it('it should be a function',(done)=>{
            expect(Message.createMessageFromUser).to.be.a('Function');
            expect(Message.updateMessageFromUser).to.be.a('Function');
            expect(Message.deleteMessageFromUser).to.be.a('Function');

            expect(Message.receiveMessages).to.be.a('Function');
            expect(Message.sentMessages).to.be.a('Function')
            
            // expect(Message.translateMessage).to.be.a('Function');
            // expect(Message.listMessagesForLanguage).to.be.a('Function');

            done();
        })

        it('it should be a promise',(done)=>{

            
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

            return Message.createMessageFromUser("598896a4e89d4546a158fa65",data).then((message)=>message._doc).should.eventually.have.all.keys('__v','_id','id','to','from','open', 'contents','lang','userId');

        });

        it('it should UPDATE a message for id',()=>{
            let data = {
                contents:"dadas"
            }

            return Message.updateMessageFromUser("598896a4e89d4546a158fa65",30,data).then((message)=>message._doc).should.eventually.have.all.keys('__v','_id','id','to','from','open', 'contents','lang');

        });

        it('it should DELETE a message for id',()=>{
            //return Message.deleteMessageFromUser(47).then((message)=>message._doc).should.eventually.have.all.keys('__v','_id','id','to','from','open', 'contents','lang');
        });
    })

    describe('API REQUEST',()=>{
        it('it should CREATE a new message with user id',(done)=>{
            let data = {            
                to:"Alvaro",
                contents:"hola amigo Alvaro",
                lang:"es",
                open:true
            };

            chai.request(server)
                .post('/api/messages/')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('contents');
                    res.body.should.have.property('lang');
                    res.body.should.have.property('to');
                    res.body.should.have.property('from');
                    done();
                });
        });

        it('it should UPDATE a message',(done)=>{
            let data = {            
                contents:"hola amigo Alvaro",
                lang:"es"
            };

            chai.request(server)
                .put('/api/messages/'+56)
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('contents');
                    res.body.should.have.property('lang');
                    res.body.should.have.property('to');
                    res.body.should.have.property('from');
                    done();
                });
        });

        it('it should DELETE a message',(done)=>{
            

            chai.request(server)
                .delete('/api/messages/'+58)
                .end((err,res)=>{
                    res.should.have.status(200);
                    
                    done();
                });
        })

    })

})