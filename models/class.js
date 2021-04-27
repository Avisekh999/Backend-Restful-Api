var express = require("express");
var mongoose = require('mongoose');

const sectionSchema = mongoose.Schema({
    section:{ type: String,
        require: true},
    noofstudent:{ type: String,
        require: true}

})

const UserSchema = mongoose.Schema({

    classid: {
        type: String,
        require: true
    },
    class: {
        type: String,
        require: true
    },

    sections:[sectionSchema],

      

    subject:{
        type: String,
        require: true
    },
    subjectid: {

        type: String,
        require: true
    },
    chapter: {
        type: String,
        require: true,

    },
    topic: {
        type: String,
        require: true
    },
  
});

module.exports = Classes = mongoose.model('Classes', UserSchema);

