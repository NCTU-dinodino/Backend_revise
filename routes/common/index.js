var express = require('express');
var router = express.Router();
var csrfProtection = require('csurf')();

var bulletin = require('./bulletin')
var data = require('./data')
var mail = require('./mail')
var time = require('./time')

// prefix of API: /_api/common
router.use('/bulletin', bulletin)
router.use('/data', data)
router.use('/mail', mail)
router.use('/time', time)

module.exports = router
