var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var getTeacherId = require('../../middleware/getTeacherId');
var offsetService = require('../../services/offset');

var TeacherId = getTeacherId.getTeacherId.teacherId;
var offsetSetAgree = offsetService.offsetApplySetAgree;
var offsetFormList = offsetService.offsetApplyFormList;

// prefix of this api: /_api/professors/offset
router.post('/agree', csrfProtection, offsetSetAgree, function (req, res) {
    res.send(req.setAgree);
});

router.get('/formList', TeacherId, offsetFormList, function (req, res) {
    res.send(req.formList);
});

module.exports = router;
