var router = require('../router.js')();
var userController = require('../controllers/userController');
var middleware = require('../middleware/authenticate')

/**
 * @api {post} /create Create a new user
 * @apiName CreateUser
 * 
 * @apiGroup User
 * @apiParam {String} email Email 
 * @apiParam {String} password Password 
 * @apiParam {String} name Name
 *
 * @apiSuccess (200) {String} name Name
 * @apiSuccess (200) {String} email Email
 * @apiSuccess (200) {String} password Password
 * @apiSuccess (200) {String} token Token
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "name":"Angel",
 *    "email":"angel@gmail.com",
 *    "token":"token"
 *  }
 */

router.post('/', userController.create);

/**
 * @api {post} /login Login a new user
 * @apiName LoginUser
 * 
 * @apiGroup User
 * @apiParam {String} email Email 
 * @apiParam {String} password Password 
 *
 * @apiSuccess (200) {String} name Name
 * @apiSuccess (200) {String} email Email
 * @apiSuccess (200) {String} token Token
 * @apiSuccess (200) {String} password Password

 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "name":"Angel",
 *    "email":"angel@gmail.com",
 *    "token":"token"
 *  }
 */

router.post('/login',userController.login);

module.exports = router;