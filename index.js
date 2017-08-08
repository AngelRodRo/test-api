'use strict';

let http = require('http'),
    config = require('./config/config.json'),
    mongoose = require('mongoose'),
    url = require('url'),
    router = require('./router.js')(),
    index = require('./routes/index.js');

mongoose.Promise = global.Promise;

process.env.limit = process.env.limit||5;

//Connect to mongodb
if(mongoose.connection.readyState!=1){
    mongoose.connect(config.dbquery,()=>{
        console.log('Its connected! ')
    });
}


// Init routes from API
router.use("/api",index);

// Create a new server and configure
let sv = http.createServer((req,res)=>{

    let pathname = url.parse(req.url).pathname;

    //Init params from requests
    req.body = "";
    req.params = "";
    req.query = "";
    
    // Initializing CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Extends function from response object for return a json object
    res.json  = function(data){
        this.writeHead(200,{ 'Content-Type': 'application/json'});
        this.end(JSON.stringify(data));
    }

    //Extends function from response object for return a status
    res.status = function(code){
        this.writeHead(code,{ })
        return this;
    }

    res.send = function(arg) {

        if(arg instanceof Number){
            let rCode  = arg || 200;
            this.writeHead(rCode,{ })
            this.end();
            return this;
        }

        this.end(JSON.stringify(arg));
        return this;
    }

    //Check if the request is POST or PUT for read data stream and convert it an object
    if(req.method === "POST" || req.method == "PUT"){
        // Return data from body of POST request
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
        // Get query data from url and set in the request object
        req.query = url.parse(req.url,true).query;
        router.check(pathname,req,res);    
    }

})

let port = process.env.PORT || config.port
sv.listen(5000,'0.0.0.0', ()=>{
    console.log('Server started!')
})




module.exports = sv;