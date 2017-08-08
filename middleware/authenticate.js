let jwt = require('jsonwebtoken'),
    config = require('../config/config.json');

module.exports = {
    authenticate(req,res,next){
        var token = req.headers.authorization;
        
        jwt.verify(token,config.secret, function(err,decoded) {
			if(err){
                console.log('Entroassasaasas aqui');
                next(true);
                return res.status(401).send();
            } 
            req.headers.user = decoded;
			return next();
		});	
        
    }
}