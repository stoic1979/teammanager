'use strict';

const mongoose = require("mongoose");

//-------------------------------------------
// Project schema definition
//-------------------------------------------
const ProjectSchema = new mongoose.Schema({
  manager: {
  	type: mongoose.Schema.Types.ObjectId, 
  	ref: 'User'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },	
  title: { 
    type: String,
    required: true
  },
  description: { 
    type: String,
    required: true
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  estimated_hours: {
    type: Number,
    required: true
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
ProjectSchema.pre('save', function(next){

    var project = this; // this refers to ProjectSchema object

    var currentDate = new Date();

    // change the updated_at field to current date
    project.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    // otherwise, only update_at will be set to current date
    if (!project.created_at) {
       project.created_at = currentDate;
    }

    next();
});

module.exports = mongoose.model("Project", ProjectSchema);
