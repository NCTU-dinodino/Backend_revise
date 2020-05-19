var express = require('express');
var router = express.Router();
var getStudentId = require('../../middleware/getStudentId');
var courseMapService = require('../../services/courseMap');

var StudentId = getStudentId.getStudentId.studentId;
var courseMapRule = courseMapService.courseMapRule;
var courseMapPass = courseMapService.courseMapPass;

// prefix of API: /_api/students/courseMap
router.get('/rule', StudentId, courseMapRule, function (req, res) {
    res.send(req.rule);
});

router.get('/pass', StudentId, courseMapPass, function (req, res) {
    res.send(req.pass);

});

module.exports = router;

