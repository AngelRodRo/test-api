'use strict';
let user = require('./user.js');
let router = require('../router.js')();
router.use("/users", user);
module.exports = router;