'use strict';

const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');


//--------------------------------------------------------------------
// User schema definition
//--------------------------------------------------------------------
const UserSchema = new mongoose.Schema({
  first_name: { 
    String,
    required: true
  },
  last_name: { 
    String,
    required: true
  },
  email: { 
    type: String, required: true, unique: true
  },
  password: {
   type: String, required: true
    },
  role: {
    type: String,
    enum: ["ADMIN", "MANAGER", "WORKER"],
    required: true
    },
  created_at: Date,
  updated_at: Date
});


//--------------------------------------------------------------------
// We can use the Schema pre method to have operations happen before
// an object is saved
//--------------------------------------------------------------------
UserSchema.pre('save', function(next){

    var user = this; // this refers to UserSchema object


    var currentDate = new Date();

    // change the updated_at field to current date
    user.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    // otherwise, only update_at will be set to current date
    if (!user.created_at) {
       user.created_at = currentDate;
    }


    // hasing the password
    if(!user.isModified('password')) return next;

    bcrypt.hash(user.password, null, null, function(err, hash) {

        if(err) return next(err);

        user.password = hash;

        next();
    });

});

//--------------------------------------------------------------------
// compare the hashed/brypted password
//--------------------------------------------------------------------
UserSchema.methods.comparePassword = function(password) {
    var user = this; 
    return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model("User", UserSchema);
