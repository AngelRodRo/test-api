'use strict';
let fs = require('fs'),
	path = require('path'),
    url = require('url');
    

let router = (function(){
    let mRoutes = [];

    //Functions for recognize http methods
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


    // Check each route in array and execute each funcion correspondent
	let check =  function(pathname,req,res) {
		if(pathname.split("/")[1] === "js" 
			|| pathname.split("/")[1] === "css" 
			|| pathname.split("/")[1] === "img"){

			this.static("./public",pathname,req,res);
		}
		else{
            let flag = false,i = 0;
            if(mRoutes.length){
             promiseWhile(function() {
                return flag;
             }, function() {
                return new Promise(function(resolve, reject) {
                    if(!(mRoutes[i] instanceof Function)){

                        if(verifyPath(mRoutes[i],pathname, req) ){	
                            if(mRoutes[i].method === req.method ){
                                let index = i;
                                
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
                    if(i==mRoutes.length-1){
                        res.writeHead(404,{})
                        res.end("Not found");
                        return;
                    }
                });
            }else{
                res.writeHead(404,{})
                        res.end("Not found");
                        return;
            }
			
		}
    }
    
    let verifyPath = function(route, pathname, req){

        let fr = route.pathname.split("/");
        let ds = pathname.split("/");
        let params = {}

        
        if(fr.length===ds.length){
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

    // In case if a request is for statics assets
	let statics = function(route,pathname,req,res) {

		fs.readFile(route + "" + pathname, function (err, statics) {
		    if(!statics){
		    	res.writeHead(404);
		    	res.end();
		    	return;
		    }

		    var file = pathname,
		    	ext = path.extname(file),
		    	opts = {};

			switch (ext) {
				case '.js':
		    		opts["Content-Type"]  = "text/javascript";
					break;
				case '.css':
		    		opts["Content-Type"] = "text/css";
					break;
				case '.jpg':
			    	opts["Content-Type"] = "text/jpeg";
			    	break;
		    	case '.png':
			    	opts["Content-Type"] = "text/png";
			    	break;	    	
			}
			
	    	res.writeHead(200,opts);
	    	res.write(statics);
	    	res.end();


		});
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
