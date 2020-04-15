var express = require('express');
var router = express.Router();
var csrfProtection = require('csurf')();
var getStudentId = require('../../../../user/common/handler/getStudentId').getStudentId.studentId;

var graduate = require('./graduate')
var recommend = require('./recommend')
var professorInfo = require('./professorInfo')
var research = require('./research')
var offsetApply = require('./offsetApply')
var chatbot = require('./chatbot')

// prefix of API: /_api/students
router.use('/graduate', graduate)
router.use('/recommend', recommend)
router.use('/professorInfo', professorInfo)
router.use('/research', research)
router.use('/offsetApply', offsetApply)
router.use('/chatbot', chatbot)

module.exports = router
