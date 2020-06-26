var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var researchService = require('../../services/research');

var researchStudentList = researchService.researchStudentList;
var researchProfessorList = researchService.researchProfessorList;
var researchGradeList = researchService.researchGradeList;
var researchGradeDownload = researchService.researchGradeDownload;
var researchSetScore = researchService.researchSetScore;
var researchDelete = researchService.researchDelete;
var researchSetAddStatus = researchService.researchSetAddStatus;
var researchSetFirstSecond = researchService.researchSetFirstSecond;
var researchStudentListDownload = researchService.researchStudentListDownload;

// prefix of this api: /_api/assistants/research
router.post('/studentList', csrfProtection, researchStudentList, function (req, res) {
    res.send(req.studentList);
});

router.post('/professorList', csrfProtection, researchProfessorList, function (req, res) {
    res.send(req.professorList);
});

router.post('/gradeList', csrfProtection, researchGradeList, function (req, res) {
    res.send(req.gradeList);
});

router.post('/gradeDownload', csrfProtection, researchGradeDownload, function (req, res) {
    res.send(req.gradeDownload);
});

router.post('/setScore', csrfProtection, researchSetScore, function (req, res) {
    res.send(req.setScore);
});

router.post('/delete', csrfProtection, researchDelete, function (req, res) {
    res.send(req.delete);
});

router.post('/setAddStatus', csrfProtection, researchSetAddStatus, function (req, res) {
    res.send(req.setAddStatus);
});

router.post('/setFirstSecond', csrfProtection, researchSetFirstSecond, function (req, res) {
    res.send(req.setFirstSecond);
});

router.post('/professorListDownload', csrfProtection, researchStudentListDownload, function (req, res) {
    res.send(req.studentListDownload);
});

module.exports = router;
