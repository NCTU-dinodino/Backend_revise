var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../common/handler/getStudentId');
var offsetApplyService = require('../../services/offsetApply');

var StudentId = getStudentId.getStudentId.studentId;
var offsetApplySetAgree = offsetApplyService.offsetApplySetAgree;
var offsetApplyInfo = offsetApplyService.offsetApplyInfo;
var offsetApplyShow = offsetApplyService.offsetApplyShow;
var offsetApplyFile = offsetApplyService.offsetApplyFile;

// prefix of this api: /_api/assistants/offsetApply
router.post('/setAgree', offsetApplySetAgree, function (req, res) {
    // router.post('plyFormAgreeStatus', offsetApplySetAgree, function(req, res) {
    res.send(req.setAgree);
});

router.get('/Info', StudentId, offsetApplyInfo, function (req, res) {
    // router.get(', StudentId, offsetApplyInfo, function(req, res) {
    res.send(req.info);
});

router.get('/Show', csrfProtection, offsetApplyShow, function (req, res) {
    // router.get('setApplyForm', offsetApplyShow, function(req, res) {
    res.send(req.show);
});

router.post('/assistants/offsetApply/File', csrfProtection, offsetApplyFile, function (req, res) {
    res.send(req.file);
});

module.exports = router;
