var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;
var offsetApplyService = require('../../services/offsetApply');

var offsetApplyList = offsetApplyService.offsetApplyList;
var offsetCreateCompulsory = offsetApplyService.offsetCreateCompulsory;
var offsetCreateEnglish = offsetApplyService.offsetCreateEnglish;
var offsetCreateExempt = offsetApplyService.offsetCreateExempt;
var offsetCreateWaive = offsetApplyService.offsetCreateWaive;
var offsetApplyEdit = offsetApplyService.offsetApplyEdit;
var offsetApplyDelete = offsetApplyService.offsetApplyDelete;

router.get('/list', getStudentId, offsetApplyList, function (req, res) {
    res.send(req.list);
});

router.post('/createCompulsory', csrfProtection, getStudentId, offsetCreateCompulsory, function (req, res) {
    res.send(req.createCompulsory);

});
router.post('/createEnglish', csrfProtection, getStudentId, offsetCreateEnglish, function (req, res) {
    res.send(req.createEnglish);

});

router.post('/createExempt', csrfProtection, getStudentId, offsetCreateExempt, function (req, res) {
    res.send(req.createExempt)
});

router.post('/createWaive', csrfProtection, getStudentId, offsetCreateWaive, function (req, res) {
    res.send(req.createWaive);
});

router.post('/edit', csrfProtection, getStudentId, offsetApplyEdit, function (req, res) {
    res.send(req.edit);
});

router.post('/delete', csrfProtection, getStudentId, offsetApplyDelete, function (req, res) {
    res.send(req.delete);
});


module.exports = router;
