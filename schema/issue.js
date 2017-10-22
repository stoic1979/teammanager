'use strict';

const mongoose = require("mongoose");

//-----------------------------------------
// Issue schema definition
//-----------------------------------------
const IssueSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project'
  },
  assignee: {
  	type: mongoose.Schema.Types.ObjectId, 
  	ref: 'User'
  },	
  summary: { 
    type: String,
    required: true
  },
  description: { 
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["TASK", "BUG", "ENHANCEMENT"],
    required: true
  },
  priority: {
    type: String,
    enum: ["BLOCKER", "HIGH", "MEDIUM", "LOW"],
    required: true
  },
  status: {
    type: String,
    enum: ["NOT-STARTED", "WORKING", "TESTING", "CLOSED", "REOPENED"],
    required: true
  },
  estimated_hours: {
    type: Number,
    required: true
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  created_at: Date,
  updated_at: Date
});

//--------------------------------------------------------------------
// We can use the Schema pre method to have operations happen before
// an object is saved
//--------------------------------------------------------------------
IssueSchema.pre('save', function(next){

    var issue = this; // this refers to IssueSchema object

    var currentDate = new Date();

    // change the updated_at field to current date
    issue.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    // otherwise, only update_at will be set to current date
    if (!issue.created_at) {
       issue.created_at = currentDate;
    }

    next();

});

module.exports = mongoose.model("Issue", IssueSchema);
