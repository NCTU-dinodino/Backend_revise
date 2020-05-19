var express = require('express');
var router = express.Router();
var getTeacherId = require('../../middleware/getTeacherId');
var curriculumService = require('../../services/curriculum');

var csrf = require('csurf');
var csrfProtection = csrf();

var TeacherId = getTeacherId.getTeacherId.teacherId;
var curriculumAllCourses = curriculumService.curriculumAllCourses;
var curriculumScoreInterval = curriculumService.curriculumScoreInterval;
var curriculumScoreDetail = curriculumService.curriculumScoreDetail;

// prefix of this api: /_api/professors/curriculum
/*老師所有開過的課*/
router.get('/allCourses', TeacherId, curriculumAllCourses, function (req, res) {
    res.send(req.allCourses);
});

/*某堂課成績區間人數*/
router.post('/scoreInterval', csrfProtection, curriculumScoreInterval, function (req, res) {
    res.send(req.scoreInterval);
});

/*某堂課成績的詳細資料*/
router.post('/scoreDetail', csrfProtection, curriculumScoreDetail, function (req, res) {
    res.send(req.scoreDetail);
});

module.exports = router;
