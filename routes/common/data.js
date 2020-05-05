var express = require('express')
var router = express.Router()
var csrf = require('csurf')
var csrfProtection = csrf()
var dataService = require('../../services/data')

var dataFormDownload = dataService.dataFormDownload
var dataUpload = dataService.dataUpload
var dataLogShow = dataService.dataLogShow
var dataLogDelete = dataService.dataLogDelete
var dataLogDeleteAll = dataService.dataLogDeleteAll

// prefix of this api: /_api/common/data
/*下載空白檔案*/
router.post('/formDownload', csrfProtection, dataFormDownload, function (req, res) {
    res.send(req.download)
})

/*上傳檔案*/
router.post('/upload', csrfProtection, dataUpload, function (req, res) {
    res.send(req.signal)
})

/*取得所有紀錄*/
router.get('/log', csrfProtection, dataLogShow, function (req, res) {
    res.send(req.dataLog)
})

/*刪除特定紀錄*/
router.post('/log/delete', csrfProtection, dataLogDelete, function (req, res) {
    res.send(req.signal)
})

/*刪除所有紀錄*/
router.get('/log/deleteAll', csrfProtection, dataLogDeleteAll, function (req, res) {
    res.send(req.signal)
})

module.exports = router
