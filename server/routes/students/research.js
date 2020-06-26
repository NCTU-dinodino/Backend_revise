var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;
var researchService = require('../../services/research');

var researchList = researchService.researchList;
var researchEdit = researchService.researchEdit;
var researchSetReplace = researchService.researchSetReplace;
var researchApplyCreate = researchService.researchApplyCreate;
var researchApplyDelete = researchService.researchApplyDelete;
var researchShowStudentStatus = researchService.researchShowStudentStatus;

// prefix of this api: /_api/students/research
router.get('/list', getStudentId, researchList, function (req, res) {
    res.send(req.list);
});


router.post('/edit', csrfProtection, researchEdit, function (req, res) {
    res.send(req.edit);
});

// 申請更換教授
router.post('/setReplace', csrfProtection, researchSetReplace, function (req, res) {
    res.send(req.setReplace);

});

router.post('/create', csrfProtection, researchApplyCreate, function (req, res) {
    res.send(req.create);

});

router.post('/delete', csrfProtection, researchApplyDelete, function (req, res) {
    res.send(req.delete);
});

router.post('/showStudentStatus', csrfProtection, researchShowStudentStatus, function (req, res) {
    res.send(req.status);
});
module.exports = router;
