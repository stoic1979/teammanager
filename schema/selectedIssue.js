'use strict';

const mongoose = require("mongoose");
  

//-------------------------------------------
// SelectedIssueSchema definition
//-------------------------------------------
const SelectedIssueSchema = new mongoose.Schema({
  issue: {
  	type: mongoose.Schema.Types.ObjectId, 
  	ref: 'Issue'
  },

  created_at: Date,
  updated_at: Date
});

//--------------------------------------------------------------------
// We can use the Schema pre method to have operations happen before
// an object is saved
//--------------------------------------------------------------------
SelectedIssueSchema.pre('save', function(next){

    var selectedIssue = this; // this refers to SelectedIssueSchema object

    var currentDate = new Date();

    // change the updated_at field to current date
    selectedIssue.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    // otherwise, only update_at will be set to current date
    if (!selectedIssue.created_at) {
       selectedIssue.created_at = currentDate;
    }

    next();
});

module.exports = mongoose.model("SelectedIssue", SelectedIssueSchema);
