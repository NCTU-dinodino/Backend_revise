var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getTeacherId = require('../common/handler/getTeacherId');
var researchApplyService = require('../../services/researchApply');

var TeacherId = getTeacherId.getTeacherId.teacherId;
var researchApplySetAgree = researchApplyService.researchApplySetAgree;
var researchApplyList = researchApplyService.researchApplyList;

// prefix of this api: /_api/professors/researchApply
router.post('/setAgree', csrfProtection, researchApplySetAgree, function (req, res) {
    res.send(req.setAgree);
});

router.get('/list', TeacherId, researchApplyList, function (req, res) {
    res.send(req.list);
});

module.exports = router;