var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var timeService = require('../../services/time');

var createApplyPeriod = timeService.createApplyPeriod;
var setApplyPeriod = timeService.setApplyPeriod;
var showApplyPeriod = timeService.showApplyPeriod;

// prefix of this api: /_api/common/time
router.post('/', csrfProtection, showApplyPeriod, function (req, res) {
    res.send(req.showApplyPeriod);
});

router.post('/new', csrfProtection, createApplyPeriod, function (req, res) {
    res.status(req.signal).end();
});

router.post('/edit', csrfProtection, setApplyPeriod, function (req, res) {
    res.status(req.signal).end();
});


module.exports = router;
