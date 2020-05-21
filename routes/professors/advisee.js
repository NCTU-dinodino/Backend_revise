var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getTeacherId = require('../../middleware/getTeacherId');
var adviseeService = require('../../services/advisee');

var TeacherId = getTeacherId.getTeacherId.teacherId;
var adviseeSemesterGradeList = adviseeService.adviseeSemesterGradeList;
var adviseeList = adviseeService.adviseeList;
var adviseePersonalInfo = adviseeService.adviseePersonalInfo;

// prefix of this api: /_api/professors/advisee
router.post('/semesterScoreList', csrfProtection, adviseeSemesterGradeList, function (req, res) {
    res.send(req.semesterGradeList);
});

router.get('/studentList', TeacherId, adviseeList, function (req, res) {
    res.send(req.list);
});

router.post('/studentInfo', csrfProtection, adviseePersonalInfo, function (req, res) {
    res.send(req.personalInfo);
});

module.exports = router;
