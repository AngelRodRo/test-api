'use strict'
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let should = chai.should();
let User = require('../models/User');

describe('User module',()=>{

    describe(' init functions ' , ()=>{
        it('it should be a function', (done) =>{
            expect(User.create).to.be.a('Function');
            done();
        });

        it('it should return a promise',(done)=>{
            expect(User.create.then).to.be.a('Function');
            done();
        });

    })
    
    describe('API Requests', ()=>{
        it('it should CREATE a new user',(done)=>{
        
            let user = {
                name:'user',
                email: 'user1@gmail.com',
                password: '123456',
            };

            chai.request(server)
                .post('/users')
                .send(user)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('lastname');
                    done();
                });
        });
    })
    
    
})