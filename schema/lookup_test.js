//------------------------------------------------------------------------------
//
// SCRIPT TO FETCH PROJECT BY TITLE & ITS FOREIGN KEY MANAGER OBJECT ALONG WITH
//
//------------------------------------------------------------------------------


'use strict';

const mongoose = require("mongoose");

var Project  = require('./project');


function getProject() {


    var title = "Whitewashing the fence";

    var t = [
        {
            $lookup:
            {
                from: "users",
                localField: "manager",
                foreignField: "_id",
                as: "manager"
            }
        },
        { 
            $match: 
                { 
                    title: title,   // where project title is this title
                }, 
        }, 
   ]; 

    Project.aggregate(t).exec().
    then(function(project){
        console.log("Project: " + JSON.stringify(project, null, 4));

    })
    .catch(function(err){
        console.log("Err: " + err);

    });
}


//--------------------------------------------------------------------------
// connection string for test database for testing schema
// we will not use production database for this
//--------------------------------------------------------------------------
const TEAM_MANAGER_TEST_MONGODB_URI = process.env.TEAM_MANAGER_TEST_MONGODB_URI;

mongoose.connect(TEAM_MANAGER_TEST_MONGODB_URI, function(err) {
    if(err) {
        console.log("[SchemaTest] failed to connect to database: " + err);
        return;
    } 

    console.log("[SchemaTest] Successfully connected to database. ");

    getProject();
});