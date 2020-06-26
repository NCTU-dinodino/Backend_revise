var express = require('express');
var router = express.Router();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;
var courseMapService = require('../../services/courseMap');

var courseMapRule = courseMapService.courseMapRule;
var courseMapPass = courseMapService.courseMapPass;

// prefix of API: /_api/students/courseMap
router.get('/rule', getStudentId, courseMapRule, function (req, res) {
    res.send(req.rule);
});

router.get('/pass', getStudentId, courseMapPass, function (req, res) {
    res.send(req.pass);

});

module.exports = router;

