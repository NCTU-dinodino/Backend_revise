var query = require('../../../../db/msql');

function bulletinShow(req, res, next) {
    if (req.session.profile) {
        query.ShowAllBulletinMsg(function (err, result) {
            if (err) {
                throw err;
                res.redirect('/')
            }
            if (!result.length) {
                res.send("bulletin empty!")
            }
            else {
                var bulletin = []
                result = JSON.parse(result)
                var i
                for (i = 0; i < result.length; ++i) {
                    var data = {
                        "id": result[i].unique_id,
                        "type": parseInt(result[i].cont_type),
                        "content": result[i].content,
                        "link": result[i].link,
                        "timestamp": result[i].create_time
                    }
                    bulletin.push(data)
                }
                bulletin.sort((a, b) => (Date.parse(a.timestamp) < Date.parse(b.timestamp)) ? 1 : -1);
                req.bulletin = bulletin
                next();
            }
        })
    }
    else
        res.redirect('/')
}

function bulletinCreate(req, res, next) {
    if (req.session.profile) {
        var bulletin = {
            cont_type: req.body.type,
            content: req.body.content
        }
        if (req.body.link === undefined || req.body.link === null);
        else bulletin["link"] = req.body.link
        query.CreateBulletinMsg(bulletin, function (err, result) {
            if (err) {
                req.signal = 403
                throw err
            }
            if (!result) {
                req.signal = 403
                next()
            }
            else {
                req.signal = 204
                next()
            }
        })
    }
    else {
        res.redirect('/')
    }
}

function bulletinEdit(req, res, next) {
    if (req.session.profile) {
        var bulletin = {
            msg_idx: req.body.id,
            cont_type: req.body.type,
            content: req.body.content,
            link: (req.body.link === undefined || req.body.link === null) ? "" : req.body.link
        }
        query.SetBulletinMsg(bulletin, function (err, result) {
            if (err) {
                req.signal = 403
                throw err
            }
            if (!result) {
                req.signal = 403
                next()
            }
            else {
                req.signal = 204
                next()
            }
        })
    }
    else {
        res.redirect('/')
    }
}

function bulletinDelete(req, res, next) {
    if (req.session.profile) {
        var bulletin = {
            msg_idx: req.body.id,
        }
        query.DeleteBulletinMsg(bulletin, function (err, result) {
            if (err) {
                req.signal = 403
                throw err
            }
            if (!result) {
                req.signal = 403
                next()
            }
            else {
                req.signal = 204
                next()
            }
        })
    }
    else {
        res.redirect('/')
    }
}

module.exports = {
    bulletinShow,
    bulletinCreate,
    bulletinEdit,
    bulletinDelete
}
