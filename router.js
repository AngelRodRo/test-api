'use strict';
let fs = require('fs'),
	path = require('path'),
    url = require('url');
    

let router = (function(){
    let mRoutes = [];

    //Functions for recognize http methods
    let methods = {
        get (name,cb) {
            let route = {
                pathname:name,
                method:"GET",
                cb:cb
            };
            mRoutes.push(route)
        },

        post(name,cb) {
            let route = {
                pathname:name,
                method:"POST",
                cb:cb
            };
            mRoutes.push(route)
        },
        
        put (name,cb) {
            let route = {
                pathname:name,
                method:"PUT",
                cb:cb
            };
            mRoutes.push(route);
        },

        delete(name,cb){
            let route = {
                pathname:name,
                method:"DELETE",
                cb:cb
            };
            mRoutes.push(route)
        }
    }

    // Add a route or group of routes with prefix
    let use = (name,router)=> {
        let routes = router.routes.slice();
        if(name){
            for (let i = 0,route; route = routes[i]; i++) {
                route.pathname = name + route.pathname;
            }

        }
        mRoutes.push(...routes);
        return;
    }

    // Check each route in array and execute each funcion correspondent
	let check =  function(pathname,req,res) {
		if(pathname.split("/")[1] === "js" 
			|| pathname.split("/")[1] === "css" 
			|| pathname.split("/")[1] === "img"){

			this.static("./public",pathname,req,res);
		}
		else{
			for (var i = 0,route; route = mRoutes[i]; i++) {
			    if(route.pathname == pathname){		    
			    	if(route.method == req.method ){
					    return route.cb(req,res);
			    	}else{	
                        res.writeHead(404,{ })
                        res.end("Not found");
				    	return;  	
			    	}
			    }
            }
            
            res.writeHead(404,{})
            res.end("Not found");
            return ;
		}

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
