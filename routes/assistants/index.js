var express = require('express');
var router = express.Router();
var csrfProtection = require('csurf')();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;

var advisee = require('./advisee')
var graduate = require('./graduate')
var offsetApply = require('./offsetApply')
var profile = require('./profile')
var research = require('./research')

// prefix of API: /_api/assistants
router.use('/advisee', advisee)
router.use('/graduate', graduate)
router.use('/offsetApply', offsetApply)
router.use('/profile', profile)
router.use('/research', research)

module.exports = router
