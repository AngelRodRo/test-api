'use strict'
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(chaiHttp);

let should = chai.should();
let User = require('../models/User');
let server = require('../index.js');
let mongoose = require('mongoose');
let config = require('../config/config');

describe('User module',()=>{

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


    describe('Init functions' , ()=>{
        it('it should be a function', (done) =>{
            expect(User.create).to.be.a('Function');
            done();
        });

        it('it should return a promise',(done)=>{
            expect(User.create().then).to.be.a('Function');
            done();
        });

        it('it should create a new User',()=>{
            let data = {
                name:"user",
                email:"user1@gmail.com",
                password:"123456"
            };
            return User.create(data).then((user)=> user._doc ).should.eventually.have.all.keys('__v','_id','name','email','id','password');
        })

    })
    
    describe('API Requests', ()=>{
        it('it should CREATE a new user',(done)=>{
        
            let user = {
                name:'user',
                email: 'user1@gmail.com',
                password: '123456'
            };

            chai.request(server)
                .post('/api/users/')
                .send(user)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    res.body.should.have.property('token');
                    done();
                });
        });
        
        it('it should login a user',(done)=>{
        
            let user = {
                email: 'user1@gmail.com',
                password: '123456'
            };

            chai.request(server)
                .post('/api/users/login')
                .send(user)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    res.body.should.have.property('token');
                    done();
                });
        });

        describe("Validations",()=>{
            it('it should not CREATE a new user when sent a request without name or email',(done)=>{
        
                let user = {
                    name:'user',
                    password: '123456'
                };

                chai.request(server)
                    .post('/api/users/')
                    .send(user)
                    .end((err,res)=>{
                        res.should.have.status(503);
                        res.should.be.a('object');
                        res.body.should.have.property('message');
                        done();
                    });
            });

            it('it should not LOGIN a user when sent a request without name or email',(done)=>{
        
                let user = {
                    name:'user',
                    password: '123456'
                };

                chai.request(server)
                    .post('/api/users/login')
                    .send(user)
                    .end((err,res)=>{
                        res.should.have.status(503);
                        res.should.be.a('object');
                        res.body.should.have.property('message');
                        done();
                    });
            });
        })

    })
    
    
})