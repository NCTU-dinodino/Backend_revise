var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var adviseeService = require('../../services/advisee');

var adviseeTeacherList = adviseeService.adviseeTeacherList;
var adviseeStudentList = adviseeService.adviseeStudentList;
var adviseeSemesterScoreList = adviseeService.adviseeSemesterScoreList;

// prefix of this api: /_api/assistants/advisee
router.get('/teacherList', csrfProtection, adviseeTeacherList, function (req, res) {
    res.send(req.teacherList);
});

router.post('/studentList', csrfProtection, adviseeStudentList, function (req, res) {
    res.send(req.studentList);
});

router.post('/semesterScoreList', csrfProtection, adviseeSemesterScoreList, function (req, res) {
    res.send(req.scoreList);
});

module.exports = router;
