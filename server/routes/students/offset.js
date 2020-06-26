var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;
var offsetService = require('../../services/offset');

var offsetList = offsetService.offsetApplyList;
var offsetCreateCompulsory = offsetService.offsetCreateCompulsory;
var offsetCreateEnglish = offsetService.offsetCreateEnglish;
var offsetCreateExempt = offsetService.offsetCreateExempt;
var offsetCreateWaive = offsetService.offsetCreateWaive;
var offsetEdit = offsetService.offsetApplyEdit;
var offsetDelete = offsetService.offsetApplyDelete;

router.get('/list', getStudentId, offsetList, function (req, res) {
    res.send(req.list);
});

router.post('/compulsory', csrfProtection, getStudentId, offsetCreateCompulsory, function (req, res) {
    res.send(req.createCompulsory);

});
router.post('/english', csrfProtection, getStudentId, offsetCreateEnglish, function (req, res) {
    res.send(req.createEnglish);

});

router.post('/exempt', csrfProtection, getStudentId, offsetCreateExempt, function (req, res) {
    res.send(req.createExempt)
});

router.post('/waive', csrfProtection, getStudentId, offsetCreateWaive, function (req, res) {
    res.send(req.createWaive);
});

router.post('/edit', csrfProtection, getStudentId, offsetEdit, function (req, res) {
    res.send(req.edit);
});

router.post('/delete', csrfProtection, getStudentId, offsetDelete, function (req, res) {
    res.send(req.delete);
});


module.exports = router;
