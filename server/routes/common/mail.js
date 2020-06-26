var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var mailService = require('../../services/mail');

var mailSend = mailService.mailSend;
var mailSent = mailService.mailSent;
var mailInbox = mailService.mailInbox;
var mailInfo = mailService.mailInfo;


// prefix of this api: /_api/common/mail
/*寄送郵件*/
router.post('/send', csrfProtection, mailSend, function (req, res) {
    res.send(req.signal);
});

/*寄件備份匣*/
router.post('/sent', csrfProtection, mailSent, function (req, res) {
    res.send(req.sent);
});

/*收件匣*/
router.get('/inbox', csrfProtection, mailInbox, function (req, res) {
    res.send(req.inbox);
});

/*單一郵件資訊以及內容*/
router.post('/info', csrfProtection, mailInfo, function (req, res) {
    res.send(req.info);
});

module.exports = router;
