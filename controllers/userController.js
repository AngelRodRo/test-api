var User = require('../models/User');
var jwt = require('jsonwebtoken');
var config = require('../config/config.json')
module.exports = {

    
    create(req,res){

        let { name, email, password } = req.body,
            error = {}

        
        if(!name) {
            error.message = "Ocurred an error while registering, you need put an name before continue";
            error.code = "41000";
            return res.json(error,503);
        }
        if(!email) {
            error.message = "Ocurred an error while registering, you need put an email before continue";
            error.code = "41000";
            return res.json(error,503);
        }

        if(!password){
            error.message = "Ocurred an error while registering, you need put an password before continue";
            error.code = "41000";
            return res.json(error,503);
        }

        User.create({
            name: name,
            email: email,
            password: password
        }).then((user)=>{   

            let _user = { name, email  };
            _user.token = jwt.sign(user, config.secret);
            return res.json(_user);

        }).catch((err)=>{
            error.message = "Ocurred an error check the details for more information";
            error.details = err.toString();
            return res.json(error,503);
        })

    },

    login(req,res){

        let email = req.body.email,
            password = req.body.password,
            error = {};

        if(!email||!password) {
            error.message = "Ocurred an error, your credentials are incorrected";
            return res.json(error,503);
        }
        
        User.login(email,password)
            .then((user)=>{
                if(user.res){
                    delete user.res;
                    user.token = jwt.sign(user, config.secret);
                    return res.json(user);
                }
                error.message = "Your credentials aren't correct";
                return res.json(error,503);

            }).catch((err)=>{
                error.message = "Ocurred an error, check details for more information";
                error.details = err.toString();
                return res.json(error,503);
            })

    }
}