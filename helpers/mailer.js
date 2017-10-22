//----------------------------------------------------------------
//   Helper script for sending email with specified mail options
//----------------------------------------------------------------

const nodemailer = require('nodemailer');
const xoauth2    = require('xoauth2');

// FIXME - unused credentials !!!
var credentials = {
    user: process.env.TEAM_MANAGER_GMAIL_USER,
    pass: process.env.TEAM_MANAGER_GMAIL_PASS,
    clientId: process.env.TEAM_MANAGER_GMAIL_CLIENT_ID,
    clientSecret: process.env.TEAM_MANAGER_GMAIL_CLIENT_SECRET,
    refreshToken: process.env.TEAM_MANAGER_GMAIL_REFRESH_TOKEN
};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TEAM_MANAGER_GMAIL_USER,
        pass: process.env.TEAM_MANAGER_GMAIL_PASS
    }
});

var mailer = function(){};

mailer.prototype.sendMail = function (subject, html) {

    // composing email options
    let options = {
        from: process.env.TEAM_MANAGER_EMAIL_FROM,
        to: process.env.TEAM_MANAGER_EMAIL_TO,
        subject: subject,
        html: html
    };

    transporter.sendMail(options, function(err, msg) {
        err ? console.log("sendMail :: got error -> " + err): console.log("sendMail sent email success,\n got msg -> " + JSON.stringify(msg) );
    });
};

module.exports = mailer;
