var express = require('express');
var router = express.Router();
var csrfProtection = require('csurf')();
var getStudentId = require('../../../../user/common/handler/getStudentId').getStudentId.studentId;

var advisee = require('./advisee')
var curriculum = require('./curriculum')
var offsetApply = require('./offsetApply')
var profile = require('./profile')
var research = require('./research')
var researchApply = require('./researchApply')

// prefix of this api: /_api/professors/
router.use('/advisee', advisee)
router.use('/curriculum', curriculum)
router.use('/offsetApply', offsetApply)
router.use('/profile', profile)
router.use('/research', research)
router.use('/researchApply', researchApply)

module.exports = router
