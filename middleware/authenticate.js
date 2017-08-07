module.exports = {
    authenticate(req,res,next){
        console.log(req.headers);
        next();
    }
}