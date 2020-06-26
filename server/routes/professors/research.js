var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var researchService = require('../../services/research');


var researchSetScore = researchService.researchSetScore;
var researchSetTitle = researchService.researchSetTitle;
var researchList = researchService.researchList;
var researchSetReplace = researchService.researchSetReplace;

// prefix of this api: /_api/professors/research
router.post('/setScore', csrfProtection, researchSetScore, function (req, res) {
    res.send(req.setScore);
});

router.post('/setTitle', csrfProtection, researchSetTitle, function (req, res) {
    res.send(req.setTitle);
});

router.post('/list', csrfProtection, researchList, function (req, res) {
    res.send(req.list);
});

router.post('/setReplace', csrfProtection, researchSetReplace, function (req, res) {
    res.send(req.reply);
});

module.exports = router;
