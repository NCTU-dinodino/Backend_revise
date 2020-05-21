var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../../middleware/getStudentId');
var offsetService = require('../../services/offset');

var StudentId = getStudentId.getStudentId.studentId;
var offsetSetAgree = offsetService.offsetApplySetAgree;
var offsetInfo = offsetService.offsetApplyInfo;
var offsetShow = offsetService.offsetApplyShow;
var offsetFile = offsetService.offsetApplyFile;

// prefix of this api: /_api/assistants/offset
router.post('/agree', offsetSetAgree, function (req, res) {
    // router.post('plyFormAgreeStatus', offsetApplySetAgree, function(req, res) {
    res.send(req.setAgree);
});

router.get('/info', StudentId, offsetInfo, function (req, res) {
    // router.get(', StudentId, offsetApplyInfo, function(req, res) {
    res.send(req.info);
});

router.get('/formList', csrfProtection, offsetShow, function (req, res) {
    // router.get('setApplyForm', offsetApplyShow, function(req, res) {
    res.send(req.show);
});

router.post('/file', csrfProtection, offsetFile, function (req, res) {
    res.send(req.file);
});

module.exports = router;
