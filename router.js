'use strict';
let fs = require('fs'),
	path = require('path'),
    url = require('url');
    

let router = (function(){
    let mRoutes = [];

    //Functions for recognize http methods and add new object route to routes array
    let methods = {
        get (pathname,...args) {
            
            let cb,md;
            let route = {};
            let method = "GET";
            if(args.length==2){
                cb = args[1];
                md = args[0];
            }else{
                cb = args[0];
            }
            route = {pathname,method,cb}
            if(md) route.md = md;

            mRoutes.push(route)
        },

        post(pathname,...args) {
            let cb,md;
            let route = {}
            let method = "POST"
            if(args.length==2){
                cb = args[1];
                md = args[0];
            }else{
                cb = args[0];
            }
            route = {pathname,method,cb}
            if(md) route.md = md;

            mRoutes.push(route)
        },
        
        put (pathname,...args) {

            let cb,md;
            let route = {}
            let method = "PUT"
            if(args.length==2){
                cb = args[1];
                md = args[0];
            }else{
                cb = args[0];
            }

            route = {pathname,method,cb}
            if(md) route.md = md;

            mRoutes.push(route);
        },

        delete(pathname,...args){
            let cb,md;
            let route = {}
            let method = "DELETE"

            if(args.length==2){
                cb = args[1];
                md = args[0];
            }else{
                cb = args[0];
            }

            route = {pathname,method,cb}
            if(md) route.md = md;
            mRoutes.push(route)
        }
    }

    // Add a route or group of routes with prefix
    let use = function(){
        var args = arguments;
        //Check if a function or a name with routes group
        if(args[0] instanceof Function){
            return mRoutes.push(args[0])
        }

        if(args[0]){
            let routes = args.length? args[1].routes.slice() : [];
            for (let i = 0,route; route = routes[i]; i++) {
                route.pathname = args[0] + route.pathname;
            }
            mRoutes.push(...routes);
        }
        return;
    }

    // Create a promise while
    var promiseWhile = function(condition, action) {
        
        var resolver = Promise.defer();

        var loop = function() {
            
            if (condition()) return resolver.resolve();

            return Promise.resolve(action())
                .then(loop)
                .catch(resolver.reject);
        };

        process.nextTick(loop);

        return resolver.promise;
    }


    // Check each route in array and execute each function correspondent
	let check =  function(pathname,req,res) {
        mRoutes.push({
            pathname:"",
            method:"",
            cb:""
        });

        if(pathname.split("/")[1] === "js" 
			|| pathname.split("/")[1] === "css" 
			|| pathname.split("/")[1] === "img"){

			this.static("./public",pathname,req,res);
		}
		else{
            let flag = false,i = 0;
            if(mRoutes.length){
            //Executing the promise until find the path or find none
            
             promiseWhile(function() {
                return flag;
             }, function() {
                return new Promise(function(resolve, reject) {
                    if(!(mRoutes[i] instanceof Function)){

                        if(verifyPath(mRoutes[i],pathname, req) ){	
                            if(mRoutes[i].method === req.method ){
                                let index = i;
                                //Check if a route has a middleware and execute its middleware before continue the principal function
                                if(mRoutes[index].md){
                                    
                                    mRoutes[index].md(req,res,function( sent = false){
                                        if(!sent){
                                            mRoutes[index].cb(req,res);
                                            flag = true;
                                        }
                                        resolve();
                                    });
                                }else{
                                    mRoutes[index].cb(req,res);
                                    
                                    flag = true;
                                    resolve();
                                }
                            }else{

                                resolve();
                            }
                        }else{         
                            resolve();
                        }
                        
                    }else{
                        mRoutes[i].md(req,res,function(sent = false){
                            flag = sent;

                            resolve();
                        })
                    }

                
                    i++;

                    if(i==mRoutes.length){
                        flag = true;
                        resolve();                        
                    }
                
                });
                }).then(function() {
                    
                    if(i==mRoutes.length){
                        if(!res.headersSent){
                            res.writeHead(404,{})
                            res.end("Not found");
                            return;
                        }
                    }
                });
            }else{
                if(!res.headersSent){
                    res.writeHead(404,{})
                    res.end("Not found");
                    return;
                }
            }
			
		}
    }
    

    let verifyPath = function(route, pathname, req){
        
        let fr = route.pathname.split("/");
        let ds = pathname.split("/");
        let params = {}

        // Verify the length and patterns for routes like "/api/:id/test"
        // for get params values from url
        if(fr.length===ds.length ){
            for (let i = 0; i < fr.length; i++) {
                if(fr[i]!=ds[i]) {
                    let index = fr[i].indexOf(":")
                    if(index<0) return false;

                    var param = fr[i].slice(1);
                    params[param] = ds[i];
                }
            }
            req.params = params;
            return true;
        }
        return false;
    }

    
    return {
        get:methods.get,
        post:methods.post,
        put: methods.put,
        use:use,
        delete:methods.delete,
        routes:mRoutes,
        check:check
    }

});

module.exports = router;
