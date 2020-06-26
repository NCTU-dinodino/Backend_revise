var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;
var recommendService = require('../../services/recommend');

var recommendCourseList = recommendService.recommendCourseList;
var recommendSetStar = recommendService.recommendSetStar;
var recommendCurrent = recommendService.recommendCurrent;

// prefix of this api: /_api/students/recommend
router.get('/courseList', getStudentId, recommendCourseList, function (req, res) {
    res.send(req.courseList);
});

router.post('/rating', csrfProtection, recommendSetStar, function (req, res) {
    res.send(req.setStar);

});

router.get('/current', getStudentId, recommendCurrent, function (req, res) {
    res.send(req.current);
});

module.exports = router;
