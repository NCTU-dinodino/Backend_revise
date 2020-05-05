var query = require('../../../../db/msql');
var utils = require('../../../../utils');
var nodemailer = require('nodemailer');
var mail_info = require('../../../auth/nctu/mail_info');


// students
/*列出該名學生的抵免列表*/
function offsetApplyList(req, res, next) {
    if (req.session.profile) {
        var StudentId = res.locals.studentId;
        var data = { student_id: StudentId };
        query.ShowUserOffsetApplyForm(data, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                var list = {
                    waive_course: [],
                    exempt_course: [],
                    compulsory_course: [],
                    english_course: []
                };
                for (var i = 0; i < result.length; i++) {
                    //轉校轉系抵免
                    var agree_status = parseInt(result[i].agree);
                    if (agree_status == 1 || agree_status == 5)
                        agree_status = 0;
                    else if (agree_status == 2)
                        agree_status = 1;
                    else if (agree_status == 3 || agree_status == 4)
                        agree_status = 2;
                    else if (agree_status == 6)
                        agree_status = 3;

                    if (result[i].offset_type === "2") {
                        var waive = {
                            "timestamp": result[i].timestamp,
                            "phone": result[i].phone,
                            "original_school": result[i].school_old,
                            "original_department": result[i].dep_old,
                            "current_school": "交通大學",
                            "current_department": "資工系",
                            "original_graduation_credit": parseInt(result[i].graduation_credit_old),
                            "apply_year": parseInt(result[i].apply_year),
                            "apply_semester": parseInt(result[i].apply_semester),
                            "original_course_year": parseInt(result[i].cos_year_old),
                            "original_course_semester": parseInt(result[i].cos_semester_old),
                            "original_course_name": result[i].cos_cname_old,
                            "original_course_department": result[i].cos_dep_old,
                            "original_course_credit": parseInt(result[i].credit_old),
                            "original_course_score": result[i].score_old,
                            "current_course_code": result[i].cos_code,
                            "current_course_name": result[i].cos_cname,
                            "current_course_credit": parseInt(result[i].credit),
                            "current_course_type": result[i].cos_type,
                            "file": result[i].file,
                            "status": agree_status,
                            "reject_reason": result[i].reject_reason

                        };
                        list.waive_course.push(waive);
                    }
                    //英授抵免
                    else if (result[i].offset_type === "1") {
                        var english = {
                            "timestamp": result[i].timestamp,
                            "apply_year": parseInt(result[i].apply_year),
                            "apply_semester": parseInt(result[i].apply_semester),
                            "phone": result[i].phone,
                            "reason": result[i].reason,
                            "department": result[i].cos_dep_old,
                            "teacher": result[i].cos_tname_old,
                            "credit": parseInt(result[i].credit),
                            "course_code": result[i].cos_code_old,
                            "course_name": result[i].cos_cname_old,
                            "file": result[i].file,
                            "status": agree_status,
                            "reject_reason": result[i].reject_reason
                        };
                        list.english_course.push(english);
                    }
                    //外系抵免
                    else if (result[i].offset_type === "0") {
                        var compulsory = {
                            "timestamp": result[i].timestamp,
                            "apply_year": parseInt(result[i].apply_year),
                            "apply_semester": parseInt(result[i].apply_semester),
                            "phone": result[i].phone,
                            "reason": {
                                "type": result[i].reason_type,
                                "content": result[i].reason
                            },
                            "department": result[i].cos_dep_old,
                            "teacher": result[i].cos_tname_old,
                            "credit": parseInt(result[i].credit),
                            "course_year": parseInt(result[i].cos_year_old),
                            "course_semester": parseInt(result[i].cos_semester_old),
                            "course_code": result[i].cos_code,
                            "course_name": result[i].cos_cname,
                            "original_course_code": result[i].cos_code_old,
                            "original_course_name": result[i].cos_cname_old,
                            "original_course_credit": parseInt(result[i].credit_old),
                            "file": result[i].file,
                            "status": agree_status,
                            "reject_reason": result[i].reject_reason
                        };
                        list.compulsory_course.push(compulsory);
                    }
                    else if (result[i].offset_type === "3") {
                        var exempt = {
                            "timestamp": result[i].timestamp,
                            "phone": result[i].phone,
                            "apply_year": parseInt(result[i].apply_year),
                            "apply_semester": parseInt(result[i].apply_semester),
                            "original_course_year": parseInt(result[i].cos_year_old),
                            "original_course_semester": parseInt(result[i].cos_semester_old),
                            "original_course_name": result[i].cos_cname_old,
                            "original_course_department": result[i].cos_dep_old,
                            "original_course_credit": parseInt(result[i].credit_old),
                            "original_course_score": result[i].score_old,
                            "current_course_code": result[i].cos_code,
                            "current_course_name": result[i].cos_cname,
                            "current_course_credit": parseInt(result[i].credit),
                            "file": result[i].file,
                            "current_course_type": result[i].cos_type,
                            "status": agree_status,
                            "reject_reason": result[i].reject_reason

                        };
                        list.exempt_course.push(exempt);
                    }

                }
            }
            req.list = list;
            if (req.list)
                next();
            else
                return;
        });
    }
    else
        res.redirect('/');

}

/*提交抵免單：本系必修課程抵免*/
function offsetCreateCompulsory(req, res, next) {
    if (req.session.profile) {
        var StudentId = res.locals.studentId;
        var data = {
            student_id: StudentId,
            phone: req.body.phone,
            apply_year: req.body.apply_year,
            apply_semester: req.body.apply_semester,
            cos_dep_old: req.body.department,
            cos_tname_old: req.body.teacher,
            cos_cname_old: req.body.original_course_name,
            cos_code_old: req.body.original_course_code,
            cos_cname: req.body.course_name,
            cos_code: req.body.course_code,
            cos_type: null,
            credit: req.body.credit,
            reason: req.body.reason.content,
            credit_old: req.body.original_course_credit,
            file: req.body.file,
            school_old: null,
            dep_old: null,
            graduation_credit_old: null,
            cos_year_old: req.body.course_year,
            cos_semester_old: req.body.course_semester,
            score_old: null,
            offset_type: 0,
            reason_type: req.body.reason.type
        };
        query.CreateOffsetApplyForm(data, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.createCompulsory = result;
                if (req.createCompulsory)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');
}

/*提交抵免單：英授專業課程抵免*/
function offsetCreateEnglish(req, res, next) {
    if (req.session.profile) {
        var StudentId = res.locals.studentId;
        var data = {
            student_id: StudentId,
            phone: req.body.phone,
            apply_year: req.body.apply_year,
            apply_semester: req.body.apply_semester,
            cos_dep_old: req.body.department,
            cos_tname_old: req.body.teacher,
            cos_cname_old: req.body.course_name,
            cos_code_old: req.body.course_code,
            cos_cname: null,
            cos_code: null,
            cos_type: null,
            credit: req.body.credit,
            reason: req.body.reason,
            credit_old: 0,
            file: req.body.file,
            school_old: '',
            dep_old: '',
            graduation_credit_old: 0,
            cos_year_old: 0,
            cos_semester_old: 0,
            score_old: 0,
            offset_type: 1,
            reason_type: null

        };
        query.CreateOffsetApplyForm(data, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.createEnglish = result;
                if (req.createEnglish)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');


}

/*提交抵免單：學分抵免*/
function offsetCreateExempt(req, res, next) {
    if (req.session.profile) {
        var student_id = res.locals.studentId;
        var data = {
            student_id: student_id,
            phone: req.body.phone,
            apply_year: req.body.apply_year,
            apply_semester: req.body.apply_semester,
            cos_dep_old: req.body.original_course_department,
            cos_tname_old: null,
            cos_cname_old: req.body.original_course_name,
            cos_code_old: null,
            cos_cname: req.body.current_course_name,
            cos_code: req.body.current_course_code,
            cos_type: req.body.current_course_type,
            credit: req.body.current_course_credit,
            reason: null,
            credit_old: parseInt(req.body.original_course_credit),
            file: req.body.file,
            school_old: null,
            dep_old: null,
            graduation_credit_old: null,
            cos_year_old: req.body.original_course_year,
            cos_semester_old: req.body.original_course_semester,
            score_old: req.body.original_course_score,
            offset_type: 3,
            reason_type: null
        };

        query.CreateOffsetApplyForm(data, function (err, result) {
            if (err)
                throw err;
            res.redirect('/');
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.createExempt = result;
                if (req.createExempt)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');

}

/*提交抵免單：課程免修*/
function offsetCreateWaive(req, res, next) {
    if (req.session.profile) {
        var student_id = res.locals.studentId;

        var data = {
            student_id: student_id,
            phone: req.body.phone,
            apply_year: req.body.apply_year,
            apply_semester: req.body.apply_semester,
            cos_dep_old: req.body.original_course_department,
            cos_tname_old: null,
            cos_cname_old: req.body.original_course_name,
            cos_code_old: null,
            cos_cname: req.body.current_course_name,
            cos_code: req.body.current_course_code,
            cos_type: req.body.current_course_type,
            credit: parseInt(req.body.current_course_credit),
            reason: null,
            credit_old: parseInt(req.body.original_course_credit),
            file: req.body.file,
            school_old: req.body.original_school,
            dep_old: req.body.original_department,
            graduation_credit_old: parseInt(req.body.original_graduation_credit),
            cos_year_old: parseInt(req.body.original_course_year),
            cos_semester_old: parseInt(req.body.original_course_semester),
            score_old: req.body.original_course_score,
            offset_type: 2,
            reason_type: null
        };
        query.CreateOffsetApplyForm(data, function (err, result) {
            if (err)
                throw err;
            res.redirect('/');
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.createWaive = result;
                if (req.createWaive)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');

}

/*更新抵免單*/
function offsetApplyEdit(req, res, next) {
    if (req.session.profile) {
        var student_id = res.locals.studentId;

        if (req.body.credit_type == 1) { // 學分抵免
            var data = {
                student_id: student_id,
                phone: req.body.phone,
                apply_year: req.body.apply_year,
                apply_semester: req.body.apply_semester,
                cos_dep_old: req.body.original_course_department,
                cos_tname_old: null,
                cos_cname_old: req.body.original_course_name,
                cos_code_old: null,
                cos_cname: req.body.current_course_name,
                cos_code: req.body.current_course_code,
                cos_type: req.body.current_course_type,
                credit: req.body.current_course_credit,
                reason: null,
                credit_old: req.body.original_course_credit,
                file: req.body.file,
                school_old: req.body.original_school,
                dep_old: req.body.original_department,
                graduation_credit_old: req.body.original_graduation_credit,
                cos_year_old: req.body.original_course_year,
                cos_semester_old: req.body.original_course_semester,
                score_old: req.body.original_course_score,
                reason_type: null,
                state: 0,
                timestamp: req.body.timestamp,
                resend: 1
            }
        }
        else if (req.body.credit_type == 2) { // 課程免修
            var data = {
                student_id: student_id,
                phone: req.body.phone,
                apply_year: req.body.apply_year,
                apply_semester: req.body.apply_semester,
                cos_dep_old: req.body.original_course_department,
                cos_tname_old: null,
                cos_cname_old: req.body.original_course_name,
                cos_code_old: null,
                cos_cname: req.body.current_course_name,
                cos_code: req.body.current_course_code,
                cos_type: req.body.current_course_type,
                credit: req.body.current_course_credit,
                reason: null,
                credit_old: req.body.original_course_credit,
                file: req.body.file,
                school_old: null,
                dep_old: null,
                graduation_credit_old: null,
                cos_year_old: req.body.original_course_year,
                cos_semester_old: req.body.original_course_semester,
                score_old: req.body.original_course_score,
                reason_type: null,
                state: 0,
                timestamp: req.body.timestamp,
                resend: 1
            }
        }
        else if (req.body.credit_type == 3) { // 必修抵免
            var data = {
                student_id: student_id,
                phone: req.body.phone,
                apply_year: req.body.apply_year,
                apply_semester: req.body.apply_semester,
                cos_dep_old: req.body.department,
                cos_tname_old: req.body.teacher,
                cos_cname_old: req.body.original_course_name,
                cos_code_old: req.body.original_course_code,
                cos_cname: req.body.course_name,
                cos_code: req.body.course_code,
                cos_type: null,
                credit: req.body.credit,
                reason: req.body.reason.content,
                credit_old: req.body.original_course_credit,
                file: req.body.file,
                school_old: null,
                dep_old: null,
                graduation_credit_old: null,
                cos_year_old: req.body.course_year,
                cos_semester_old: req.body.course_semester,
                score_old: null,
                reason_type: req.body.reason.type,
                state: 0,
                timestamp: req.body.timestamp,
                resend: 1
            }

        }
        else if (req.body.credit_type == 4) { // 英授抵免
            var data = {
                student_id: student_id,
                phone: req.body.phone,
                apply_year: req.body.apply_year,
                apply_semester: req.body.apply_semester,
                cos_dep_old: req.body.department,
                cos_tname_old: req.body.teacher,
                cos_cname_old: req.body.course_name,
                cos_code_old: req.body.course_code,
                cos_cname: null,
                cos_code: null,
                cos_type: null,
                credit: req.body.credit,
                reason: req.body.reason,
                credit_old: null,
                file: req.body.file,
                school_old: null,
                dep_old: null,
                graduation_credit_old: null,
                cos_year_old: null,
                cos_semester_old: null,
                score_old: null,
                reason_type: null,
                state: 0,
                timestamp: req.body.timestamp,
                resend: 1
            }
        }
        query.ModifyOffsetApplyForm(data, function (err, result) {
            if (err)
                throw err;
            res.redirect('/');
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.edit = result;
                if (req.edit)
                    next();
                else
                    return;
            }
        });
    } else {
        res.redirect('/');
    }
}

/*刪除抵免單*/
function offsetApplyDelete(req, res, next) {
    if (req.session.profile) {
        var student_id = res.locals.studentId;
        var data = {
            timestamp: req.body.timestamp,
            student_id: student_id
        }
        query.DeleteOffsetApplyForm(data, function (err, result) {
            if (err)
                throw err;
            res.redirect('/');
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.delete = result;
                if (req.delete)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');

}
// students end

// assistants
/* 助理改變抵免申請單狀態，並寄信通知 */
function offsetApplySetAgree(req, res, next) {
    if (req.session.profile) {
        var assistant_email = '';
        var teacher_email = '';
        var assistantId = utils.getPersonId(JSON.parse(req.session.profile));
        query.ShowUserInfo(assistantId, function (err, result) {
            if (err) {
                throw err;
                return;
            }
            if (!result) {
                return;
            }
            result = JSON.parse(result);
            assistant_email = result[0].email;
        });
        if (req.body.transferTo) {
            query.ShowUserInfo(req.body.transferTo, function (err, result) {
                if (err) {
                    throw err;
                    return;
                }
                if (!result) {
                    return;
                }
                result = JSON.parse(result);
                teacher_email = result[0].email;
            });
        }

        var state_check = [];
        var mails = [];
        for (var i = 0; i < req.body.courses.length; i++) {
            var data = {
                timestamp: req.body.courses[i].timestamp,
                student_id: req.body.courses[i].sid,
                state: req.body.status,
                // status: 0 申請中，1 等候主管同意，2 同意抵免，3 抵免失敗(助理不同意)，4 抵免失敗(教授不同意)，5 等候老師同意，6 退回等學生修改
                reject_reason: req.body.courses[i].reason,
                transferto: req.body.transferTo
            }
            query.SetOffsetApplyFormAgreeStatus(data, function (err, result) {
                if (err) {
                    throw err;
                    res.redirect('/');
                }
                if (!result)
                    res.redirect('/');
                else {
                    result = JSON.parse(result);
                    state_check.push(result);
                }
            });
            query.ShowUserInfo(req.body.courses[i].sid, function (err, result) {
                if (err) {
                    throw err;
                    return;
                }
                if (!result) {
                    return;
                }
                result = JSON.parse(result);
                mails.push(result[0].email);
            });
        }
        setTimeout(function () {
            var mailString = '';
            var nameString = '';
            for (var j = 0; j < mails.length; j++) {
                mailString = mailString + mails[j] + ',';
                //nameString = nameString + info.participants[j] + ',';
            }
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: mail_info.auth
            });

            var options = {
                //寄件者
                from: 'nctucsca@gmail.com',
                //收件者
                to: mailString,
                //副本
                cc: /*req.body.sender_email*/'',
                //密件副本
                bcc: '',
                //主旨
                subject: '', // Subject line
                //純文字
                /*text: 'Hello world2',*/ // plaintext body
                //嵌入 html 的內文
                html: '<p>此信件由系統自動發送，請勿直接回信！若有任何疑問，請至系辦詢問助理，謝謝。</p><br/><p>請進入交大資工線上助理核可申請表/確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
                //附件檔案
                /*attachments: [ {
                    filename: 'text01.txt',
                    content: '聯候家上去工的調她者壓工，我笑它外有現，血有到同，民由快的重觀在保導然安作但。護見中城備長結現給都看面家銷先然非會生東一無中；內他的下來最書的從人聲觀說的用去生我，生節他活古視心放十壓心急我我們朋吃，毒素一要溫市歷很爾的房用聽調就層樹院少了紀苦客查標地主務所轉，職計急印形。團著先參那害沒造下至算活現興質美是為使！色社影；得良灣......克卻人過朋天點招？不族落過空出著樣家男，去細大如心發有出離問歡馬找事'
                }]*/
            };

            if (req.body.status == 2) {
                options.subject = '[交大資工線上助理]同意抵免申請郵件通知';
            }
            else if (req.body.status == 3) {
                options.subject = '[交大資工線上助理]不同意抵免申請郵件通知';
            }
            else if (req.body.status == 5) {
                options.to = teacher_email;
                options.subject = '[交大資工線上助理]轉交抵免申請郵件通知';
                options.html = '<p>此信件由系統自動發送，請勿直接回信！抵免申請審核已由助理轉交至老師，等候老師同意。若有任何疑問，請至系辦詢問助理，謝謝。</p><br/><p>請進入交大資工線上助理核可申請表/確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
            }
            else if (req.body.status == 6) {
                options.subject = '[交大資工線上助理]退回抵免申請(等候學生修改)郵件通知';
                options.html = '<p>此信件由系統自動發送，請勿直接回信！退回申請原因請進入系統查看。若有任何疑問，請至系辦詢問助理，謝謝。</p><br/><p>請進入交大資工線上助理確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
            }

            if (req.body.status == 2 || req.body.status == 3 || req.body.status == 5 || req.body.status == 6) {
                transporter.sendMail(options, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                });
            }

            var signal = { signal: JSON.parse(state_check[0].info.affectedRows) };
            req.setAgree = signal;
            if (req.setAgree)
                next();
            else
                return;
        }, 1000);

    }
    else
        res.redirect('/');
}

/* 列出該學生的抵免申請單 */
function offsetApplyInfo(req, res, next) {
    if (req.session.profile) {
        var StudentId = res.locals.studentId;
        var data = { student_id: StudentId };
        // console.log(data);
        query.ShowUserOffsetApplyForm(data, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                var list = {
                    waive_course: [],
                    exempt_course: [],
                    compulsory_course: [],
                    english_course: []
                };
                for (var i = 0; i < result.length; i++) {
                    //轉校轉系抵免
                    var agree_status = parseInt(result[i].agree);
                    if (agree_status == 1 || agree_status == 5)
                        agree_status = 0;
                    else if (agree_status == 2)
                        agree_status = 1;
                    else if (agree_status == 3 || agree_status == 4)
                        agree_status = 2;
                    else if (agree_status == 6)
                        agree_status = 3;
                    if (result[i].offset_type === "2") {
                        var waive = {
                            "timestamp": result[i].timestamp,
                            "phone": result[i].phone,
                            "original_school": result[i].school_old,
                            "original_department": result[i].dep_old,
                            "current_school": "交通大學",
                            "current_department": "資工系",
                            "original_graduation_credit": parseInt(result[i].graduation_credit_old),
                            "apply_year": parseInt(result[i].apply_year),
                            "apply_semester": parseInt(result[i].apply_semester),
                            "original_course_year": parseInt(result[i].cos_year_old),
                            "original_course_semester": parseInt(result[i].cos_semester_old),
                            "original_course_name": result[i].cos_cname_old,
                            "original_course_department": result[i].cos_dep_old,
                            "original_course_credit": parseInt(result[i].credit_old),
                            "original_course_score": result[i].score_old,
                            "current_course_code": result[i].cos_code,
                            "current_course_name": result[i].cos_cname,
                            "current_course_credit": parseInt(result[i].credit),
                            "current_course_type": result[i].cos_type,
                            "file": result[i].file,
                            "status": agree_status,
                            "reject_reason": result[i].reject_reason
                        };
                        list.waive_course.push(waive);
                    } else if (result[i].offset_type === "1") { // 英授抵免
                        var english = {
                            "timestamp": result[i].timestamp,
                            "apply_year": parseInt(result[i].apply_year),
                            "apply_semester": parseInt(result[i].apply_semester),
                            "phone": result[i].phone,
                            "reason": result[i].reason,
                            "department": result[i].cos_dep_old,
                            "teacher": result[i].cos_tname_old,
                            "credit": parseInt(result[i].credit),
                            "course_code": result[i].cos_code_old,
                            "course_name": result[i].cos_cname_old,
                            "file": result[i].file,
                            "status": agree_status,
                            "reject_reason": result[i].reject_reason
                        };
                        list.english_course.push(english);
                    } else if (result[i].offset_type === "0") { // 外系抵免
                        var compulsory = {
                            "timestamp": result[i].timestamp,
                            "apply_year": parseInt(result[i].apply_year),
                            "apply_semester": parseInt(result[i].apply_semester),
                            "phone": result[i].phone,
                            "reason": {
                                "type": result[i].reason_type,
                                "content": result[i].reason
                            },
                            "department": result[i].cos_dep_old,
                            "teacher": result[i].cos_tname_old,
                            "credit": parseInt(result[i].credit),
                            "course_year": parseInt(result[i].cos_year_old),
                            "course_semester": parseInt(result[i].cos_semester_old),
                            "course_code": result[i].cos_code,
                            "course_name": result[i].cos_cname,
                            "original_course_code": result[i].cos_code_old,
                            "original_course_name": result[i].cos_cname_old,
                            "original_course_credit": parseInt(result[i].credit_old),
                            "file": result[i].file,
                            "status": agree_status,
                            "reject_reason": result[i].reject_reason
                        };
                        list.compulsory_course.push(compulsory);
                    } else if (result[i].offset_type === "3") {
                        var exempt = {
                            "timestamp": result[i].timestamp,
                            "phone": result[i].phone,
                            "apply_year": parseInt(result[i].apply_year),
                            "apply_semester": parseInt(result[i].apply_semester),
                            "original_course_year": parseInt(result[i].cos_year_old),
                            "original_course_semester": parseInt(result[i].cos_semester_old),
                            "original_course_name": result[i].cos_cname_old,
                            "original_course_department": result[i].cos_dep_old,
                            "original_course_credit": parseInt(result[i].credit_old),
                            "original_course_score": result[i].score_old,
                            "current_course_code": result[i].cos_code,
                            "current_course_name": result[i].cos_cname,
                            "current_course_credit": parseInt(result[i].credit),
                            "file": result[i].file,
                            "current_course_type": result[i].cos_type,
                            "status": agree_status,
                            "reject_reason": result[i].reject_reason
                        };
                        list.exempt_course.push(exempt);
                    }
                }
            }
            req.info = list;
            if (req.info)
                next();
            else
                return;
        });
    }
    else
        res.redirect('/');
}

/* 列出所有學生的抵免申請單 */
function offsetApplyShow(req, res, next) {
    if (req.session.profile) {
        var data1 = { student_id: '0516003' };
        var data2 = { all_student: true };
        // var year = req.body.apply_year;
        // var sem = req.body.apply_semester;
        query.ShowUserOffsetApplyForm(data2, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                //console.log(result);
                var group = [];
                for (var i = 0; i < result.length; i++) {
                    // if(result[i].apply_year != year || result[i].apply_semester != sem) continue;
                    var one = {
                        "apply_year": result[i].apply_year,
                        "apply_semester": parseInt(result[i].apply_semester),
                        "sid": result[i].student_id,
                        "name": result[i].sname,
                        "program": result[i].program,
                        "grade": result[i].grade,
                        "info": result[i].program + "大" + result[i].grade,
                        "phone": result[i].phone,
                        "nameA": result[i].cos_cname_old,
                        "codeA": result[i].cos_code_old,
                        "department": result[i].cos_dep_old,
                        "teacher": result[i].cos_tname_old,
                        "creditA": parseInt(result[i].credit_old),
                        "nameB": result[i].cos_cname,
                        "codeB": result[i].cos_code,
                        "creditB": parseInt(result[i].credit),
                        "typeB": result[i].cos_type,
                        "type": parseInt(result[i].offset_type),
                        "score": result[i].score_old,
                        "reason": result[i].reason,
                        "reason_type": result[i].reason_type,
                        "reject_reason": result[i].reject_reason,
                        "status": parseInt(result[i].agree),
                        "previous": result[i].previous == "0" ? false : true,
                        "date": result[i].timestamp,
                        "transferTo": "",
                        "cos_year_old": result[i].cos_year_old,
                        "cos_semester_old": parseInt(result[i].cos_semester_old),
                        "resend": parseInt(result[i].resend) === 1 ? true : false
                    };
                    // "file": result[i].file,

                    if (one.type == 0) {
                        one.nameA = result[i].cos_cname;
                        one.codeA = result[i].cos_code;
                        one.creditA = parseInt(result[i].credit);
                        one.nameB = result[i].cos_cname_old;
                        one.codeB = result[i].cos_code_old;
                        one.creditB = parseInt(result[i].credit_old);
                    }
                    if (result[i].transferto != null)
                        one.transferTo = result[i].transferto;
                    group.push(one);
                }
                req.show = group;
                next();
                /*
                if (group.length == result.length) {
                    req.show = group;
                    if (req.show)
                        next();
                    else
                        return;
                } 
                */
            }
        });
    }
    else
        res.redirect('/');
}


function offsetApplyFile(req, res, next) {
    if (req.session.profile) {
        var input = req.body;
        query.ShowUserOffsetApplyForm({ all_student: true }, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                for (var i = 0; i < result.length; i++) {
                    if (result[i].timestamp !== input.date || result[i].student_id !== input.sid)
                        continue;
                    req.file = {
                        "file": result[i].file
                    }
                    next();
                }
            }
        });
    } else res.redirect('/');
}
// assistants end

// professors
function offsetApplySetAgree(req, res, next) {
    if (req.session.profile) {
        var teacherId = utils.getPersonId(JSON.parse(req.session.profile));
        var teacher_email = '';
        query.ShowUserInfo(teacherId, function (err, result) {
            if (err) {
                throw err;
                return;
            }
            if (!result) {
                return;
            }
            result = JSON.parse(result);
            teacher_email = result[0].email;
        });

        var state_check = [];
        var mails = [];
        for (var i = 0; i < req.body.courses.length; i++) {
            var data = {
                timestamp: req.body.courses[i].timestamp,
                student_id: req.body.courses[i].sid,
                state: req.body.status,
                reject_reason: req.body.courses[i].reason,
                transferto: ""
            }
            query.SetOffsetApplyFormAgreeStatus(data, function (err, result) {
                if (err) {
                    throw err;
                    res.redirect('/');
                }
                if (!result)
                    res.redirect('/');
                else {
                    result = JSON.parse(result);
                    state_check.push(result);
                }
            });
            query.ShowUserInfo(req.body.courses[i].sid, function (err, result) {
                if (err) {
                    throw err;
                    return;
                }
                if (!result) {
                    return;
                }
                result = JSON.parse(result);
                mails.push(result[0].email);
            });
        }
        setTimeout(function () {
            var mailString = '';
            var nameString = '';
            for (var j = 0; j < mails.length; j++) {
                mailString = mailString + mails[j] + ',';
                //nameString = nameString + info.participants[j] + ',';
            }
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: mail_info.auth
            });

            var options = {
                //寄件者
                from: 'nctucsca@gmail.com',
                //收件者
                to: mailString,
                //副本
                cc: /*req.body.sender_email*/'',
                //密件副本
                bcc: '',
                //主旨
                subject: '', // Subject line
                //純文字
                /*text: 'Hello world2',*/ // plaintext body
                //嵌入 html 的內文
                html: '<p>此信件由系統自動發送，請勿直接回信！若有任何疑問，請直接聯絡 老師：' + teacher_email + '，謝謝。</p><br/><p>請進入交大資工線上助理確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
                //附件檔案
                /*attachments: [ {
                    filename: 'text01.txt',
                    content: '聯候家上去工的調她者壓工，我笑它外有現，血有到同，民由快的重觀在保導然安作但。護見中城備長結現給都看面家銷先然非會生東一無中；內他的下來最書的從人聲觀說的用去生我，生節他活古視心放十壓心急我我們朋吃，毒素一要溫市歷很爾的房用聽調就層樹院少了紀苦客查標地主務所轉，職計急印形。團著先參那害沒造下至算活現興質美是為使！色社影；得良灣......克卻人過朋天點招？不族落過空出著樣家男，去細大如心發有出離問歡馬找事'
                }]*/
            };

            if (req.body.status == 2) {
                options.subject = '[交大資工線上助理]同意抵免申請郵件通知';
            }
            else if (req.body.status == 4) {
                options.subject = '[交大資工線上助理]不同意抵免申請郵件通知';
            }

            if (req.body.status == 2 || req.body.status == 4) {
                transporter.sendMail(options, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                });
            }

            req.setAgree = { signal: JSON.parse(state_check[0].info.affectedRows) };
            if (req.setAgree)
                next();
            else
                return;
        }, 800);
    }
    else
        res.redirect('/');
}


function offsetApplyFormList(req, res, next) {
    if (req.session.profile) {
        var teacherId = res.locals.teacherId;
        var data1 = { student_id: '0516003' };
        var data2 = { all_student: true };
        query.ShowUserOffsetApplyForm(data2, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                var group = [];
                for (var i = 0; i < result.length; i++) {
                    var one = {
                        "year": result[i].apply_year,
                        "semester": parseInt(result[i].apply_semester),
                        "sid": result[i].student_id,
                        "name": result[i].sname,
                        "phone": result[i].phone,
                        "nameA": result[i].cos_cname_old,
                        "codeA": result[i].cos_code_old,
                        "department": result[i].cos_dep_old,
                        "teacher": result[i].cos_tname_old,
                        "creditA": parseInt(result[i].credit_old),
                        "nameB": result[i].cos_cname,
                        "codeB": result[i].cos_code,
                        "creditB": parseInt(result[i].credit),
                        "typeB": result[i].cos_type,
                        "type": parseInt(result[i].offset_type),
                        "score": result[i].score_old,
                        "reason": result[i].reason,
                        "reason_type": result[i].reason_type,
                        "reject_reason": result[i].reject_reason,
                        "status": parseInt(result[i].agree),
                        "previous": result[i].previous == "0" ? false : true,
                        "date": result[i].timestamp,
                        "file": result[i].file,
                        "transferTo": ""
                    };

                    if (one.type == 0) {
                        one.nameA = result[i].cos_cname;
                        one.codeA = result[i].cos_code;
                        one.creditA = parseInt(result[i].credit);
                        one.nameB = result[i].cos_cname_old;
                        one.codeB = result[i].cos_code_old;
                        one.creditB = parseInt(result[i].credit_old);
                    }
                    if (result[i].transferto != null) {
                        one.transferTo = result[i].transferto;
                        if (one.transferTo == teacherId) {
                            group.push(one);
                        }
                    }
                }
                setTimeout(function () {
                    req.formList = group;
                    if (req.formList)
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
// professors end

module.exports = {
    // students
    offsetApplyList,
    offsetCreateCompulsory,
    offsetCreateEnglish,
    offsetCreateExempt,
    offsetCreateWaive,
    offsetApplyEdit,
    offsetApplyDelete,
    // assistants
    offsetApplySetAgree,
    offsetApplyInfo,
    offsetApplyShow,
    offsetApplyFile,
    // professors
    offsetApplySetAgree,
    offsetApplyFormList
};
