var express = require("express");
var mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    userid: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    mobilenumber: {

        type: String,
        require: true
    },
    phonenumber: {
        type: String,
        require: true,

    },
    address: {
        type: String,
        require: true
    },
    pincode: {
        type: String,
        require: true
    },
    district: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    board: {
        type: String,
        require: true
    },
    school: {
        type: String,
        require: true
    },
    profilephoto: {
        type: String,
        require: true
    }
});

module.exports = Management = mongoose.model('Management', UserSchema);

