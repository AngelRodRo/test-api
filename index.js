'use strict';

let http = require('http');
let config = require('./config/config.json');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/testmetro',()=>{
    console.log('Esta conectado')
});

let sv = http.createServer((req,res)=>{
    res.end('Hola mundo');
})

sv.listen(config.port,config.host, ()=>{
    console.log('Started server')
})


module.exports = sv;