var router = require('../router.js')();
var userController = require('../controllers/userController');


/**
 * @api {post} /create Create a new user
 * @apiName CreateUser
 * 
 * @apiGroup User
 * @apiParam {String} email Email 
 * @apiParam {String} password Password 
 *
 * @apiSuccess (200) {String} name Name
 * @apiSuccess (200) {String} email Email
 * @apiSuccess (200) {String} password Password

 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "name":"Angel",
 *    "email":"angel@gmail.com",
 *    "token":"token"
 *  }
 */

router.post('/',userController.create);

router.get('/',userController.getAll);

module.exports = router;