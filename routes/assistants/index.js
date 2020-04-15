var express = require('express');
var router = express.Router();
var csrfProtection = require('csurf')();
var getStudentId = require('../../../../user/common/handler/getStudentId').getStudentId.studentId;

var graduate = require('./graduate.js')

// prefix of API: /_api/assistants
router.use('/graduate', graduate)

module.exports = router
