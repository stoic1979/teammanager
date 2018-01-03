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
        
        Member.find( {team: team_id }&&{'is_accepted':'true'})
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

        // approving user
        Member.update({user: decoded._id}, {is_accepted: true}, function(err, numberAffected, rawResponse) {

            console.log("-- saved: " + err);

            if(err) res.send("Token verification failed!");

            else {

                var parentDir  = __dirname.substring(0, __dirname.lastIndexOf('/'));
                res.sendFile(parentDir + '/public/views/general/verification_done.html') ;
                }
            })
        });//jsonwebtoken
    });

function sendInvitationEmail(req, email, token) {
    const subject = "Welcome to team manager";
    var html = "<b>Hi   </b><br>, <br> Welcome !!! <br> Team Manager is a perfect solution for managing your project and teams !!! <br>";

    html += "<br> Click on following link to verify your email.";

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

    User.findOne({
        email: req.body.email
            
        }).exec(function(err, user) {   

        if(err) throw err;

        if(!user) {
            res.send({ success: false, message: 'User does not exist !'});
            
        } else if(user) {

            //----------------------------------------------
            // before logging, ensure that user is verified
            //----------------------------------------------
            if(!user.is_verified) {

                console.log("------------ user not verified ----");

                res.send(JSON.stringify( { success: false, message: 'User is not verified, please check you email for verification. '} )  );
                return; 
            }

            else {

                console.log("User  exists");
                var user_id=user._id;
                console.log("user id is "+user_id);
                var token = tokenMaker.createUserToken(user);
                
                // res.json({ success: true, message: 'Invitation sent to ' + email}); 
                sendInvitationEmail(req, email, tokenMaker.createVerificationToken(user));

             }
        }
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

        member.save(function(err) {
            
            if(err) {
                console.log("member save error: " + err);
                res.send(err);
                return;
            }
            console.log("member created");
        });

        res.json({ success: true, message: 'member created !', member: member});

        }); // Team
    });

});
module.exports = router;
