var express = require('express')
var router = express.Router()
var csrf = require('csurf')
var csrfProtection = csrf()
var bulletinService = require('../../services/bulletin')

var bulletinShow = bulletinService.bulletinShow
var bulletinCreate = bulletinService.bulletinCreate
var bulletinEdit = bulletinService.bulletinEdit
var bulletinDelete = bulletinService.bulletinDelete

// prefix of this api: /_api/common/bulletin
/*取得所有公告*/
router.get('/', csrfProtection, bulletinShow, function (req, res) {
    res.send(req.bulletin)
})

/*新增公告*/
router.post('/bulletin', csrfProtection, bulletinCreate, function (req, res) {
    res.status(req.signal).end()
})

/*編輯公告*/
router.post('/edit', csrfProtection, bulletinEdit, function (req, res) {
    res.status(req.signal).end()
})

/*刪除公告*/
router.post('/delete', csrfProtection, bulletinDelete, function (req, res) {
    res.status(req.signal).end()
})

module.exports = router
