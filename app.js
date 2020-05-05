var path = require('path');
var https = require('https');
var session = require('client-sessions');
var express = require('express');
var app = express();
var utils = require('./utils');
// var randoms = require('./randomVals');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var csrfProtection = csrf();
var helmet = require('helmet');

app.use(helmet());
// app.use(session({
//     cookieName: "session",
//     secret: randoms.randomVals.sessionKey,
//     httpOnly: true,
//     secure: true,
//     //duration: 1 * 60 * 1000,
//     //activeDuration : 5 * 60 * 1000,
//     duration: 0,
//     activeDuration : 20 * 60 * 1000,
// }));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(csrfProtection);
app.use(require('./middleware/setCsrf').setCsrf);
// app.use(require('./middleware/setProfile').setProfile);

app.use('/_api/students', require('./routes/students'))
app.use('/_api/assistants', require('./routes/assistants'))
app.use('/_api/professors', require('./routes/professors'))
app.use('/_api/common', require('./routes/common'))
  
// app.use('/^\/assistants|\/teachers|\/students/', (req, res, next) => {
//     if(!req.profile)
//         res.redirect('/');
//     next();
// });

// app.use('/assistants', (req, res, next) => {
//     if(JSON.parse(req.session.profile).personStatus != 'a') res.redirect('/');
//     next();
// });

// app.use('/students', (req, res, next) => {
//     if(JSON.parse(req.session.profile).personStatus != 'w' && JSON.parse(req.session.profile).personStatus != 's') res.redirect('/');
//     next();
// });

// app.use('/teachers', (req, res, next) => {
//     if(JSON.parse(req.session.profile).personStatus != 'p') res.redirect('/');
//     next();
// });

// app.use('/assistants/*', function(req, res, next){
//     res.locals.studentId = req.query.student_id
//     next();
// });
// app.use('/students/*', function(req, res, next){
//     if(!res.locals.studentId);
//       res.locals.studentId = '0316248';
//       //res.locals.studentId = utils.getPersonId(JSON.parse(req.session.profile));
//     next();
// });

// app.use('/_api', routes)

// test routes
// try{app.use(require('./routes/backend_test/testAPI.js'));}catch(e){}
// try{app.use(require('./routes/backend_test/testAPI_2.js'));}catch(e){}
// try{app.use(require('./routes/backend_test/leodetest.js'));}catch(e){}
// try{app.use(require('./routes/backend_test/testDB.js'));}catch(e){}


module.exports = app;
