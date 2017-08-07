var router = require('../router.js')();
var messageController = require('../controllers/messageController');


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


router.post('/',messageController.create);
router.delete('/:id',messageController.delete);
router.put('/:id',messageController.update);
router.get('/receive',messageController.receive);
router.get('/sent',messageController.sent);
router.get('/:lang',messageController.getMessagesForLanguage);
router.get('/:id/translate/:lang',messageController.translate);

module.exports = router;