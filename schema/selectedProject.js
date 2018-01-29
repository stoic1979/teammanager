'use strict';

const mongoose = require("mongoose");
  

//-------------------------------------------
// Project schema definition
//-------------------------------------------
const SelectedProjectSchema = new mongoose.Schema({
  project: {
  	type: mongoose.Schema.Types.ObjectId, 
  	ref: 'Project'
  },

  created_at: Date,
  updated_at: Date
});

//--------------------------------------------------------------------
// We can use the Schema pre method to have operations happen before
// an object is saved
//--------------------------------------------------------------------
SelectedProjectSchema.pre('save', function(next){

    var selectedProject = this; // this refers to ProjectSchema object

    var currentDate = new Date();

    // change the updated_at field to current date
    selectedProject.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    // otherwise, only update_at will be set to current date
    if (!selectedProject.created_at) {
       selectedProject.created_at = currentDate;
    }

    next();
});

module.exports = mongoose.model("SelectedProject", SelectedProjectSchema);
