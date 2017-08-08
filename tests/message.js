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
let User = require('../models/User');
let config = require('../config/config');
let seed = require('../db/seeders/index');
describe('Message',()=>{

    before(function(done){
        mongoose.Promise = global.Promise;
        if(mongoose.connection.readyState!=1){
            mongoose.connect(config.dbquery, { useMongoClient: true } ,()=>{
                done()
            });
        }else{
            done()
        }
    })

    describe('Init functions',()=>{

        it('it should be a function',(done)=>{
            expect(Message.createMessageFromUser).to.be.a('Function');
            expect(Message.updateMessageFromUser).to.be.a('Function');
            expect(Message.deleteMessageFromUser).to.be.a('Function');

            expect(Message.receiveMessages).to.be.a('Function');
            expect(Message.sentMessages).to.be.a('Function')
            
            expect(Message.translateMessage).to.be.a('Function');
            expect(Message.getMessagesForLanguage).to.be.a('Function');
            expect(Message.find).to.be.a('Function');
            expect(Message.findOne).to.be.a('Function');

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
                contents:"hey! how are u",
                lang:"es",
                open:true
            };

            return Message.createMessageFromUser(1,data).then((message)=>message._doc).should.eventually.have.all.keys('__v','_id','to','from','open','id', 'contents','lang','createdAt');

        });

        it('it should UPDATE a message for id',()=>{
            let data = {
                contents:"dadas"
            }

            return Message.updateMessageFromUser(1,4,data).then((message)=>message._doc).should.eventually.have.all.keys('__v','_id','id','to','from','open', 'contents','lang','createdAt');

        });

        it('it should DELETE a message for id',(done)=>{
            done();
            //return Message.deleteMessageFromUser(47).then((message)=>message._doc).should.eventually.have.all.keys('__v','_id','id','to','from','open', 'contents','lang');
        });

        it('it should return all messages',()=>{
            return Message.find().exec().should.eventually.to.be.an('array');
        });

        it('it should return a message from id',()=>{
            return Message.findOne({id:1}).exec().then((message)=>message._doc).should.eventually.have.all.keys('__v','_id','id','to','from','open', 'contents','lang','createdAt');
        })

        it('it should return all receive messages from user id ',()=>{
            return Message.receiveMessages(1).then((messages)=>messages).should.eventually.to.be.an('array');
        })

        it('it should return all sent messages from user id ',()=>{
            return Message.receiveMessages(1).then((messages)=>messages).should.eventually.to.be.an('array');
        })

        it('it should translate a message',()=>{
            return Message.translateMessage(1,'es').then((messages)=>messages).should.eventually.to.be.an('object');
        })

        it('it should fetch all messages in a determinated language',()=>{
            return Message.getMessagesForLanguage('en').then((messages)=>messages).should.eventually.to.be.an('array');
        })

    })

    describe('API REQUEST',()=>{

        let token = "";
        let messageId = "";

        

        before((done)=>{
            
            let data = {
                name:'Angel',
                email: 'angel@gmail.com',
                password:'123456'
            };

            User.create(data)
                .then(()=> {
                    chai.request(server)
                        .post('/api/users/login')
                        .send(data)
                        .end((err,res)=>{
                            token = res.body.token;
                            done();
                        });
                })
        });

        describe('Unauthorized requests ',()=>{
            it('it should not CREATE a new message', (done)=>{
                let data = {            
                    to:"Alvaro",
                    contents:"hello world",
                    lang:"es",
                    open:true
                };

                chai.request(server)
                    .post('/api/messages/')
                    .set('Authorization',"12")
                    .send(data)
                    .end((err,res)=>{
                        messageId = res.body.id;
                        res.should.have.status(401);
                        done();
                    });
            });

            it('it should not UPDATE a message',(done)=>{
                let data = {         
                    contents:"Hello World!",
                    lang:"en"
                };


                chai.request(server)
                .put('/api/messages/'+1)
                .set('Authorization',"dummyToken")
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(401);
                    done();
                });
            });

            it('it should not DELETE a message',(done)=>{
            
                chai.request(server)
                .delete('/api/messages/1')
                .set('Authorization',"dummyToken")
                .end((err,res)=>{
                    res.should.have.status(401);
                    
                    done();
                });
            })

            it('it should not get all sent messages from user',(done)=>{
        
                chai.request(server)
                .get('/api/messages/sent')
                .set('Authorization',"dummyToken")
                .end((err,res)=>{
                    res.should.have.status(401);
                    done();
                });
            })

            it('it should not get all receive messages from user',(done)=>{
        
                chai.request(server)
                .get('/api/messages/receive')
                .set('Authorization',"dummyToken")
                .end((err,res)=>{
                    res.should.have.status(401);
                    done();
                });
            })
        })

        

        it('it should CREATE a new message with user id',(done)=>{
            let data = {            
                to:"Alvaro",
                contents:"hola amigo Alvaro",
                lang:"es",
                open:true
            };

            chai.request(server)
                .post('/api/messages/')
                .set('Authorization',token)
                .send(data)
                .end((err,res)=>{
                    messageId = res.body.id;
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
                contents:"Hello World!",
                lang:"en"
            };


            chai.request(server)
                .put('/api/messages/'+messageId)
                .set('Authorization',token)
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

         it('it should return all messages',(done)=>{

            chai.request(server)
                .get('/api/messages/')
                .set('Authorization',token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

        it('it should return a message for id',(done)=>{

            chai.request(server)
                .get('/api/messages/'+messageId+'/one')
                .set('Authorization',token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('contents');
                    res.body.should.have.property('lang');
                    res.body.should.have.property('to');
                    res.body.should.have.property('from');
                    done();
                });
        });


        it('it should get all sent messages from user',(done)=>{
        
            chai.request(server)
                .get('/api/messages/sent')
                .set('Authorization',token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.an('array');

                    done();
                });
        })

        it('it should get all receive messages from user',(done)=>{
            
            Message.create({
                "to":"Angel",
                "from":"Alvaro",
                "contents":"Hey! How are u",
                "lang":"en"
            }).then(()=>{
                chai.request(server)
                    .get('/api/messages/receive')
                    .set('Authorization',token)
                    .end((err,res)=>{
                        res.should.have.status(200);
                        res.body.should.be.an('array');

                        done();
                    });
            })

            
        })

        it('it should DELETE a message',(done)=>{
            

            chai.request(server)
                .delete('/api/messages/'+58)
                .set('Authorization',token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    
                    done();
                });
        })

        it('it should fetch all messages of a determinated language',(done)=>{
            
            let lang = "en";
            chai.request(server)
                .get('/api/messages/'+lang)
                .set('Authorization',token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('count');
                    res.body.should.have.property('objects');
                    done();
                });
        })

    })

})