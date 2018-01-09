var express      = require('express');
var router       = express.Router();
var jsonwebtoken = require('jsonwebtoken');
const Mailer     = require('../helpers/mailer');
const TokenMaker = require('../helpers/tokenMaker');


var secretKey = process.env.TEAM_MANAGER_SECRET_KEY;

var tokenMaker = new TokenMaker(secretKey);
var mailer     = new Mailer();

var Member = require('../schema/member');
var User = require('../schema/user');
var Team = require('../schema/team');


//-----------------------------------------------------
//   Get Members
//-----------------------------------------------------
router.get('/all', function(req, res) {

    var manager_id = req.decoded._id;

    Team.findOne( {manager:manager_id})

    .exec(function(err, team) {

        if(err) {
            res.send({ success: false, message: 'Team not found'});
            return;
        }

        var team_id=team._id;
        var team_name=team.name;
        console.log("team name" +team_name);
        Member.find( {team: team_id})
        .populate('team')
        .populate('user', ['_id', 'first_name', 'last_name', 'email'])
        .exec(function(err, members) {

            if(err) {
                res.send(err);
                return;
            }
            res.json(members);
        });
    });
});

//-----------------------------------------------------
//   VERIFY
//-----------------------------------------------------
router.get('/verify/:token', function(req, res) {
    var token = req.params.token;

    console.log("Got verification token: " + token);

    if(!token) {
        res.send("No token found!");
        return;
    }

    jsonwebtoken.verify(token, secretKey, function(err, decoded){

        if(err) {
            res.send("Token verification failed!");
            return;
        }
        var _id=decoded._id;
        console.log("id -------------->" +_id);
        // approving user
        Member.update({_id: decoded._id}, {is_accepted: true}, function(err, numberAffected, rawResponse) {

            console.log("-- saved: " + err);

            if(err) res.send("Token verification failed!");

            else {

                var parentDir  = __dirname.substring(0, __dirname.lastIndexOf('/'));
                res.sendFile(parentDir + '/public/views/general/verification_done.html') ;
                }
            })
        });//jsonwebtoken
    });

function sendMemberInvitationEmail(req, email, token) {
    const subject = "Welcome to team manager";
    var html = "<b>Hi   </b><br>, <br> Welcome !!! <br> Team Manager is a perfect solution for managing your project and teams !!! <br>";

    html += "<br> Click on following link to accept your invitation to join team.";

    // origin will tell localhost or server domain url's prefix
    var origin = req.get('origin');

    html += "<br><a href='" + origin + "/members/verify/" + token + "'>VERIFY ME</a>";

    html += "<br><br> Thanks <br> Team Manager Team";

    mailer.sendMail(email, subject, html);
}

//-----------------------------------------------------
//   INVITE USER TO TEAM
//-----------------------------------------------------
router.post('/invite_team_member', function(req, res) {

    var manager_id = req.decoded._id;
    var email = req.body.email;
    if(!email){
        res.send({success:false ,message:'Email can not be empty'});
        return;
    }
    console.log("manager id" +manager_id);
    console.log("requested email "+email);

    User.findOne({
        email: email

        }).exec(function(err, user) {

        if(err) res.send(err);

        if(!user) {
            res.send({ success: false, message: 'User does not exist !'});
            return;
        }
        var user_id=user._id;
        Team.findOne( {manager:manager_id })

        .exec(function(err, team) {

            if(err) {
                res.send({ success: false, message: 'Team not found'});
                return;
            }

            var team_id=team._id;

            var member = new Member({
                team: team_id,
                user: user_id,

            });

            member.save(function(err, savedMember) {

                if(err) {
                    console.log("member save error: " + err);
                    res.send(err);
                    return;
                }
                console.log("member created");


                console.log("User  exists");
                var member_id=savedMember._id;
                console.log("member_id-------->"+member_id);
                console.log("user id is "+user_id);
                var token = tokenMaker.createUserToken(member_id);

                // res.json({ success: true, message: 'Invitation sent to ' + email});
                sendMemberInvitationEmail(req, email, tokenMaker.createMembershipToken(member_id));

                res.json({ success: true, message: 'member created !', member: member});


            });// member.save

            }); // Team
        }); // User
    });

module.exports = router;
