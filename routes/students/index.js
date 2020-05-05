var express = require('express');
var router = express.Router();
var csrfProtection = require('csurf')();
var getStudentId = require('../../../../user/common/handler/getStudentId').getStudentId.studentId;

var courseMap = require('./courseMap')
var graduate = require('./graduate')
var offsetApply = require('./offsetApply')
var professorInfo = require('./professorInfo')
var profile = require('./profile')
var recommend = require('./recommend')
var research = require('./research')
var chatbot = require('./chatbot')

// prefix of API: /_api/students
router.use('/courseMap', courseMap)
router.use('/graduate', graduate)
router.use('/offsetApply', offsetApply)
router.use('/professorInfo', professorInfo)
router.use('/profile', profile)
router.use('/recommend', recommend)
router.use('/research', research)
router.use('/chatbot', chatbot)         // TODO

module.exports = router
