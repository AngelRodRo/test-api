'use strict';
let user = require('./user.js');
let message = require('./message.js');

let router = require('../router.js')();

router.use("/users", user);
router.use("/messages",message);

module.exports = router;