'use strict';

const mongoose = require("mongoose");

//--------------------------------------------------------------------
// Task schema definition
//--------------------------------------------------------------------
const TaskSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project'
  },
  worker: {
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
TaskSchema.pre('save', function(next){

    var task = this; // this refers to TaskSchema object

    var currentDate = new Date();

    // change the updated_at field to current date
    task.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    // otherwise, only update_at will be set to current date
    if (!task.created_at) {
       task.created_at = currentDate;
    }

    next();

});

module.exports = mongoose.model("Task", TaskSchema);
