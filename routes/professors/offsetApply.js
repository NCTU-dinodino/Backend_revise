var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getTeacherId = require('../common/handler/getTeacherId');
var offsetApplyService = require('../../services/offsetApply');

var TeacherId = getTeacherId.getTeacherId.teacherId;
var offsetApplySetAgree = offsetApplyService.offsetApplySetAgree;
var offsetApplyFormList = offsetApplyService.offsetApplyFormList;

// prefix of this api: /_api/professors/offsetApply
router.post('/setAgree', csrfProtection, offsetApplySetAgree, function (req, res) {
    res.send(req.setAgree);
});

router.get('/formList', TeacherId, offsetApplyFormList, function (req, res) {
    res.send(req.formList);
});

module.exports = router;
