var router = require('../router.js')();
var messageController = require('../controllers/messageController');
var middleware = require('../middleware/authenticate');

router.get('/',messageController.getAll);
router.get('/:id/one',messageController.getOne);

/**
 * @api {post} /messages/ Create a new message
 * @apiName CreateMessage
 * 
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiGroup Message
 * @apiParam {String} to To 
 * @apiParam {String} contents Contents 
 * @apiParam {String} lang Lang 
 *
 * @apiSuccess (200) {String} to To
 * @apiSuccess (200) {String} from From
 * @apiSuccess (200) {String} contents Contents
 * @apiSuccess (200) {String} lang Lang

 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "from" : "User 1",
 *    "to":"User 2",
 *    "contents":"hello world!",
 *    "lang":"en"
 *  }
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 503 Service Unavailable
 *  {
 *    "error": "error",
 *    "details":"details"
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 401 Unauthorized
 *  {
 *    "error": "error",
 *    "details":"details"
 *  }
 */


router.post('/', middleware.authenticate, messageController.create);

/**
 * @api {delete} /messages/:id Delete a message
 * @apiName DeleteMessage
 * 
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiGroup Message
 * @apiParam {Number} id Id 
 *

 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 401 Unauthorized
 *  {
 *  }
 */


router.delete('/:id',middleware.authenticate, messageController.delete);

/**
 * @api {put} /messages/:id Update a message of user
 * @apiName UpdateMessage
 * 
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiGroup Message
 * 
 * @apiParam {Number} id Number 
 * @apiParam {String} contents Contents 
 * @apiParam {String} lang Language 
 *
 * @apiSuccess (200) {String} contents Contents
 * @apiSuccess (200) {String} lang Language
 * @apiSuccess (200) {String} to To
 * @apiSuccess (200) {String} from From

 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "contents":"Hello world!",
 *    "to":"User 1",
 *    "from":"User 2",
 *    "lang":"es",
 *    "open":true
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 503 Service Unavailable
 *  {
 *    "error": "error",
 *    "details":"details"
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 401 Unauthorized
 *  {
 *  }
 */

router.put('/:id', middleware.authenticate, messageController.update);

/**
 * @api {get} /messages/receive Get all receive messages of user
 * @apiName GetAllReceiveMessages
 * 
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiGroup Message
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "contents":"Hello world!",
 *      "to":"User 1",
 *      "from":"User 2",
 *      "lang":"es",
 *      "open":true
 *    },
 *    {
 *      "contents":"Hello world!",
 *      "to":"User 2",
 *      "from":"User 1",
 *      "lang":"es",
 *      "open":true
 *    }
 *  ]
 * 
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 401 Unauthorized
 *  {
 *  }
 */

router.get('/receive', middleware.authenticate, messageController.receive);

/**
 * @api {get} /messages/sent Get all sent messages of user
 * @apiName GetAllSentMessages
 * 
 * @apiGroup Message
 * 
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "contents":"Hello world!",
 *      "to":"User 1",
 *      "from":"User 2",
 *      "lang":"es",
 *      "open":true
 *    },
 *    {
 *      "contents":"Hello world!",
 *      "to":"User 2",
 *      "from":"User 1",
 *      "lang":"es",
 *      "open":true
 *    }
 *  ]
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 401 Unauthorized
 *  {
 *  }
 */


router.get('/sent', middleware.authenticate, messageController.sent);

/**
 * @api {get} /messages/:lang Get all messages per language
 * @apiName GetAllMessagesPerLan
 * 
 * @apiGroup Message
 * 
 * @apiParam {String} lang Language 
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "contents":"Hello world!",
 *      "to":"User 1",
 *      "from":"User 2",
 *      "lang":"es",
 *      "open":true
 *    },
 *    {
 *      "contents":"Hello world!",
 *      "to":"User 2",
 *      "from":"User 1",
 *      "lang":"es",
 *      "open":true
 *    }
 *  ]
 * 
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 503 Service Unavailable
 *  {
 *  }
 */
router.get('/:lang',messageController.getMessagesForLanguage);

/**
 * @api {get} /messages/:id/translate/:lang Translate a message for id
 * @apiName TranslateMessage
 * 
 * @apiGroup Message
 * @apiParam {Number} id Id 
 * @apiParam {String} lang Language 
 *
 * @apiSuccess (200) {String} name Name
 * @apiSuccess (200) {String} email Email
 * @apiSuccess (200) {String} password Password

 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "message":{
 *      "contents":"Hello world!",
 *      "to":"User 2",
 *      "from":"User 1",
 *      "lang":"es",
 *      "open":true
 *    },
 *    "translate":"Hola Mundo"
 *  }
 */

router.get('/:id/translate/:lang',messageController.translate);

module.exports = router;