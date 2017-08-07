'use strict';

let http = require('http'),
    config = require('./config/config.json'),
    mongoose = require('mongoose'),
    url = require('url'),
    router = require('./router.js')(),
    index = require('./routes/index.js');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/testmetro',()=>{
    console.log('Esta conectado')
});

router.use("/api",index);

let sv = http.createServer((req,res)=>{

    let pathname = url.parse(req.url).pathname;
    
    // Extends function from response object for return a json object
    res.json  = function(data){
        this.writeHead(200,{ 'Content-Type': 'application/json'});
        this.end(JSON.stringify(data));
    }


    res.send = function(file,code) {

        if(!code) code = 200;

        if(file){
            this.writeHead(200,{ 'Content-Type': 'text/html' })
            this.write(file);
        }
        this.end();
    }
        
    if(req.method === "POST"){
        // Return data from body of POST request
        console.log('Entro aqui')
        let body = "";
        req.on('data', function (chunk) {
            body += String(chunk);
        });
        req.on('end', function () {
            // Check if data is a object 
            if(body&& !(body instanceof Object)) req.body = JSON.parse(body);
            router.check(pathname,req,res);
        });
        return;
    }else{
        req.query = url.parse(req.url,true).query;
        router.check(pathname,req,res);    
    }

})

sv.listen(config.port,config.host, ()=>{
    console.log('Server started!')
})




module.exports = sv;