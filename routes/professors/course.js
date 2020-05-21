var express = require('express');
var router = express.Router();
var getTeacherId = require('../../middleware/getTeacherId');
var courseService = require('../../services/course');

var csrf = require('csurf');
var csrfProtection = csrf();

var TeacherId = getTeacherId.getTeacherId.teacherId;
var allCourse = courseService.allCourse;
var scoreInterval = courseService.scoreInterval;
var scoreDetail = courseService.scoreDetail;

// prefix of this api: /_api/professors/course
/*老師所有開過的課*/
router.get('/', TeacherId, allCourse, function (req, res) {
    res.send(req.allCourses);
});

/*某堂課成績區間人數*/
router.post('/scoreInterval', csrfProtection, scoreInterval, function (req, res) {
    res.send(req.scoreInterval);
});

/*某堂課成績的詳細資料*/
router.post('/scoreDetail', csrfProtection, scoreDetail, function (req, res) {
    res.send(req.scoreDetail);
});

module.exports = router;
