var express = require('express');
var router = express.Router();
var csrfProtection = require('csurf')();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;

var advisee = require('./advisee')
var graduation = require('./graduation')
var offset = require('./offset')
var profile = require('./profile')
var research = require('./research')

// prefix of API: /_api/assistants
router.use('/advisee', advisee)
router.use('/graduation', graduation)
router.use('/offset', offset)
router.use('/profile', profile)
router.use('/research', research)

module.exports = router
