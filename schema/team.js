'use strict';

const mongoose = require("mongoose");

//----------------------------------------
// Team schema definition
//----------------------------------------
const TeamSchema = new mongoose.Schema({
  manager: {
  	type: mongoose.Schema.Types.ObjectId, 
  	ref: 'User'
  },	
  name: { 
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date
});

//--------------------------------------------------------------------
// We can use the Schema pre method to have operations happen before
// an object is saved
//--------------------------------------------------------------------
TeamSchema.pre('save', function(next){

    var team = this; // this refers to TeamSchema object

    var currentDate = new Date();

    // change the updated_at field to current date
    team.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    // otherwise, only update_at will be set to current date
    if (!team.created_at) {
       team.created_at = currentDate;
    }

    next();
});

module.exports = mongoose.model("Team", TeamSchema);
