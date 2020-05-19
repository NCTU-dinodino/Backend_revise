var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;
var professorInfoService = require('../../services/professorInfo');

var professorInfoPastResearch = professorInfoService.professorInfoPastResearch;
var professorInfoList = professorInfoService.professorInfoList;
var professorInfoGetMentor = professorInfoService.professorInfoGetMentor;

// prefix of this api: /_api/students/professorInfo
router.post('/pastResearch', csrfProtection, professorInfoPastResearch, function (req, res) {
    res.send(req.pastResearch);
});

router.get('/list', csrfProtection, professorInfoList, function (req, res) {
    res.send(req.list);
});
router.get('/getMentor', getStudentId, professorInfoGetMentor, function (req, res) {
    res.send(req.getMentor);
});

module.exports = router;
