var express = require('express');
var router = express.Router();
var csrfProtection = require('csurf')();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;

var courseMap = require('./courseMap')
var graduation = require('./graduation')
var offset = require('./offset')
var professor = require('./professor')
var profile = require('./profile')
var recommend = require('./recommend')
var research = require('./research')
// var chatbot = require('./chatbot')

// prefix of API: /_api/students
router.use('/courseMap', courseMap)     // TODO 拔
router.use('/graduation', graduation)
router.use('/offset', offset)
router.use('/professor', professor)
router.use('/profile', profile)
router.use('/recommend', recommend)
router.use('/research', research)
// router.use('/chatbot', chatbot)         // TODO

module.exports = router
