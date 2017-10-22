//----------------------------------------------------------------
//   Script for testing helper scripts
//----------------------------------------------------------------

const Mailer = require('./mailer');
var mailer = new Mailer();

const subject = "Welcome to team manager, manage your projects and teams efficiently";
const html    = "Team Manager is a perfect solution for managing your project and teams !!!";
const to      = process.env.TEAM_MANAGER_EMAIL_TO
mailer.sendMail(to, subject, html);
