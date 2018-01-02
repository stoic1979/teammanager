'use strict';

const mongoose = require("mongoose");

//-------------------------------------------
// Project schema definition
//-------------------------------------------
const MemberSchema = new mongoose.Schema({
  team: {
  	type: mongoose.Schema.Types.ObjectId, 
  	ref: 'Team'
  },	
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  is_accepted: {
    type: Boolean, 
    default: false
  },
  created_at: Date,
  updated_at: Date
});

//--------------------------------------------------------------------
// We can use the Schema pre method to have operations happen before
// an object is saved
//--------------------------------------------------------------------
MemberSchema.pre('save', function(next){

    var member = this; // this refers to MembersSchema object

    var currentDate = new Date();

    // change the updated_at field to current date
    member.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    // otherwise, only update_at will be set to current date
    if (!member.created_at) {
       member.created_at = currentDate;
    }

    next();
});

module.exports = mongoose.model("Member", MemberSchema);
