var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../../middleware/getStudentId');
var recommendService = require('../../services/recommend');

var StudentId = getStudentId.getStudentId.studentId;
var recommendCourseList = recommendService.recommendCourseList;
var recommendSetStar = recommendService.recommendSetStar;
var recommendCurrent = recommendService.recommendCurrent;

// prefix of this api: /_api/students/recommend
router.get('/courseList', StudentId, recommendCourseList, function (req, res) {
    res.send(req.courseList);
});

router.post('/setStar', csrfProtection, recommendSetStar, function (req, res) {
    res.send(req.setStar);

});

router.get('/current', StudentId, recommendCurrent, function (req, res) {
    res.send(req.current);
});

module.exports = router;
