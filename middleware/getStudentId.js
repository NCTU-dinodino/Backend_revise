var utils = require('../utils');
var getStudentId = {};

getStudentId.studentId = function (req, res, next) {

    if (req.session.profile) {
        let checkIndexStart = checkPage.indexOf("/", 2);
        let checkIndexEnd = checkPage.indexOf("/", checkIndexStart + 1);

        // skip _api to get the url of students or assistants
        checkPage = checkPage.substring(checkIndexStart + 1, checkIndexEnd);

        // get students or assistants
        if (checkPage === "students") {

            res.locals.studentId = utils.getPersonId(JSON.parse(req.session.profile));
            if (res.locals.studentId[0] == 'E') {
                res.locals.studentId = '0416004';
            }
        }
        else if (checkPage === "assistants") {
            res.locals.professional_field = req.query.professional_field;

            res.locals.studentId = req.query.student_id;
        }

        //res.locals.studentId = '';
        req.csca.student_id = res.locals.studentId;

        next();
    }
    else
        res.redirect('/');
}

getStudentId.studentId_post = function (req, res, next) {
    if (req.session.profile) {
        res.locals.studentId = req.body.student_id;
        next();
    } else {
        res.redirect('/');
    }
}

exports.getStudentId = getStudentId;
