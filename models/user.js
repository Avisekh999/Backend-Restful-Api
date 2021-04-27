var express = require("express");
var mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  userid:{
    type:String,
     require:true
  },
   name:{

     type:String,
     require:true
   },
   email:{
       type:String,
       require:true,
       unique: true,
   },
   password:{
     type:String,
     require:true
   },
   confirmpassword:{
       type:String,
       require:true
   },
   role:{
        type:String,
        require:true
   }
});

module.exports = User = mongoose.model('User',UserSchema);

