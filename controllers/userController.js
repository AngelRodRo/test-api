var User = require('../models/User');
var jwt = require('jsonwebtoken');
var config = require('../config/config.json')
module.exports = {

    /**
     * 
     */

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */

    create(req,res){

        let { name, email, password } = req.body;
        let error = {}

        
        if(!name) {
            error.message = "Ocurred an error while registering, you need put an name before continue";
            error.code = "41000";
            return res.status(503).send(error);
        }
        if(!email) {
            error.message = "Ocurred an error while registering, you need put an email before continue";
            error.code = "41000";
            return res.status(503).send(error);
        }

        if(!password){
            error.message = "Ocurred an error while registering, you need put an password before continue";
            error.code = "41000";
            return res.status(503).send(error);
        }

        User.create({
            name: name,
            email: email,
            password: password
        }).then((user)=>{   

            let _user = {
                name : user.name,
                email: user.email,
            };
            _user.token = jwt.sign(user, config.secret);
            return res.json(_user);

        }).catch((err)=>{
            let error = {}
            error.message = "Ocurred an error check the details for more information";
            error.details = err.toString();
            return res.status(503).send(error);
        })

    }

}