var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../../middleware/getStudentId');
var offsetApplyService = require('../../services/offsetApply');

var getStudentId = require('../../middleware/getStudentId');
var offsetApplyList = offsetApplyService.offsetApplyList;
var offsetCreateCompulsory = offsetApplyService.offsetCreateCompulsory;
var offsetCreateEnglish = offsetApplyService.offsetCreateEnglish;
var offsetCreateExempt = offsetApplyService.offsetCreateExempt;
var offsetCreateWaive = offsetApplyService.offsetCreateWaive;
var offsetApplyEdit = offsetApplyService.offsetApplyEdit;
var offsetApplyDelete = offsetApplyService.offsetApplyDelete;

router.get('/list', StudentId, offsetApplyList, function (req, res) {
    res.send(req.list);
});

router.post('/createCompulsory', csrfProtection, StudentId, offsetCreateCompulsory, function (req, res) {
    res.send(req.createCompulsory);

});
router.post('/createEnglish', csrfProtection, StudentId, offsetCreateEnglish, function (req, res) {
    res.send(req.createEnglish);

});

router.post('/createExempt', csrfProtection, StudentId, offsetCreateExempt, function (req, res) {
    res.send(req.createExempt)
});

router.post('/createWaive', csrfProtection, StudentId, offsetCreateWaive, function (req, res) {
    res.send(req.createWaive);
});

router.post('/edit', csrfProtection, StudentId, offsetApplyEdit, function (req, res) {
    res.send(req.edit);
});

router.post('/delete', csrfProtection, StudentId, offsetApplyDelete, function (req, res) {
    res.send(req.delete);
});


module.exports = router;
