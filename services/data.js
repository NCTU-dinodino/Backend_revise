var table = {};
var fs = require('fs');
var Readable = require('stream').Readable;
var query = require('../db/msql');
var data_path = "/home/nctuca/dinodino-extension/automation/data";
var sample_path = "/home/nctuca/dinodino-extension/automation/sample";

function dataFormDownload(req, res, next) {
    if (req.session.profile) {
        var fileName = req.body.data_type;
        fs.readFile(sample_path + '/' + fileName + '範例.xlsx', function (err, result) {
            req.download = result.toString('base64');
            if (req.download)
                next();
            else
                return;
        });
    }
    else
        res.redirect('/');
}

function dataUpload(req, res, next) {
    if (req.session.profile) {
        var input = req.body;
        const buffer = Buffer.from(input.file_data, 'base64');
        var readStream = new Readable();
        var now = new Date();
        var date = now.toLocaleString().split(" ")[0];
        var time = now.toLocaleString().split(" ")[1];
        var fileName = input.data_type + '_' + date + '_' + time + '.xlsx';
        var writeStream = fs.createWriteStream(data_path + '/' + fileName);
        readStream.push(buffer);
        readStream.push(null);
        readStream.pipe(writeStream);
        writeStream.on('finish', function (err) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            else {
                query.InsertNewData({ file_name: fileName, data_type: input.data_type, semester: input.semester });
                setTimeout(function () {
                    req.signal = { signal: 1 };
                    if (req.signal)
                        next();
                    else
                        return;
                }, 1000);
            }
        });
    }
    else
        res.redirect('/');
}

function dataLogShow(req, res, next) {
    if (req.session.profile) {
        query.ShowAllDataLog(function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            else {
                var dataLog = [];
                result = JSON.parse(result);
                for (var i = 0; i < result.length; ++i) {
                    var log = {
                        "id": result[i].unique_id,
                        "time": result[i].time,
                        "status": result[i].status,
                        "message": result[i].message,
                        "data_type": result[i].data_type,
                        "year": result[i].year,
                        "semester": result[i].semester
                    }
                    dataLog.push(log);
                }
                req.dataLog = dataLog;
                next();
            }
        })
    }
    else
        res.redirect('/');
}

function dataLogDelete(req, res, next) {
    if (req.session.profile) {
        query.DeleteDataLog({ id: req.body.id }, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            result = JSON.parse(result);
            var signal = {
                signal: (parseInt(result.info.affectedRows) > 0) ? 1 : 0
            }
            req.signal = signal;
            if (req.signal)
                next();
            else
                return;
        })
    }
    else
        res.redirect('/')
}

function dataLogDeleteAll(req, res, next) {
    if (req.session.profile) {
        query.DeleteAllDataLog(function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            result = JSON.parse(result);
            var signal = {
                signal: (parseInt(result.info.affectedRows) > 0) ? 1 : 0
            }
            req.signal = signal;
            if (req.signal)
                next();
            else
                return;
        })
    }
    else
        res.redirect('/')
}

module.exports = {
    dataFormDownload,
    dataUpload,
    dataLogShow,
    dataLogDelete,
    dataLogDeleteAll
}
