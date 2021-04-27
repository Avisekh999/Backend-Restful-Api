var express = require("express");
var passport = require("passport");
var bcrypt = require("bcrypt");
const jsonwt = require("jsonwebtoken");
var router = express.Router();
var User = require("../models/User");
var key = require("../mysetup/myurl");

var Management = require("../models/Management");
var Class = require("../models/class");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    }, fileFilter: fileFilter
});
const saltRounds = 10;



router.post("/signup", async (req, res) => {
    var newUser = new User({
        userid: 1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        role: req.body.role

    });

    console.log(req.body);
    await User.findOne({ email: newUser.email })
        .then(async profile => {
            if (!profile) {
                bcrypt.hash(newUser.password, saltRounds, async (err, hash) => {
                    if (err) {
                        console.log("Error is", err.message);
                    } else {
                        newUser.password = hash;
                        newUser.confirmpassword = hash;

                        if (newUser.role === "Management") {
                            newUser.userid = "MANG_" + Math.floor(1000 + Math.random() * 9000);
                            res.status(200).send(newUser);
                        }
                        else if (newUser.role === "Teacher") {
                            newUser.userid = "TEAC_" + Math.floor(1000 + Math.random() * 9000);
                            res.status(200).send(newUser);
                        }
                        else if (newUser.role === "Student") {
                            newUser.userid = "STUD_" + Math.floor(1000 + Math.random() * 9000);
                            res.status(200).send(newUser);
                        }
                        else if (newUser.role === "Parents") {
                            newUser.userid = "PARE_" + Math.floor(1000 + Math.random() * 9000);
                            res.status(200).send(newUser);
                        }
                        await newUser
                            .save()
                            .then(() => {
                                res.status(200).send(newUser);
                            })
                            .catch(err => {
                                console.log("Error is ", err.message);
                            });
                    }
                });
            }
            else {
                res.send("User already exists...");
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
        });

});


router.post("/login", async (req, res) => {
    var newUser = {};
    newUser.userid = req.body.userid;
    newUser.name -= req.body.name;
    newUser.password = req.body.password;
    newUser.email = req.body.email;
    newUser.role = req.body.role;

    await User.findOne({ email: newUser.email })
        .then(profile => {
            if (!profile) {
                res.send({ message: "User Doesn't Exist" });

                // }else if (!newUser.role) {
                //     res.send("role authorization problem");

            } else if (newUser.role !== profile.role) {
                res.send({ message: "Your Role Authorization Failed !! Please, Try Again" });
            } else {
                bcrypt.compare(
                    newUser.password,
                    profile.password,

                    async (err, result) => {
                        if (err) {
                            console.log("Error is", err.message);
                        } else if (result == true) {
                            // res.send(`User authenciated as ${role}`);
                            const payload = {
                                id: profile.id,
                                name: profile.name
                            };
                            jsonwt.sign(
                                payload,
                                key.secret,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) {
                                        console.log("Error is ", err.message);
                                    }
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token,
                                        id: profile.userid,
                                        email: profile.email,
                                        role: profile.role

                                    });
                                }
                            );
                        }
                        else {
                            res.send({ message: "User Unauthorized Access" });
                        }
                    }
                );
            }
        })
        .catch(err => {
            console.log("Error is ", err.message);
        });
});


router.get('/logout', function (req, res) {
    req.logout();
    // res.redirect('/');
    res.send('Succesfully Logged out');
});


router.get('/users/:userid', async (req, res) => {
    try {
        const book = await User.findOne({ userid: req.params.userid, userId: req.user && req.user.id });
        res.json(book);
    } catch (err) {
        res.json({ error: err.message || err.toString() });
    }
});


router.post("/management", upload.single('profilephoto'), async (req, res) => {
    console.log(req.file);
    var newManagement = new Management({
        userid: req.body.userid,
        name: req.body.name,
        email: req.body.email,
        mobilenumber: req.body.mobilenumber,
        phonenumber: req.body.phonenumber,
        address: req.body.address,
        pincode: req.body.pincode,
        district: req.body.district,
        state: req.body.state,
        board: req.body.board,
        school: req.body.school,
        profilephoto: req.file.path

    });
    console.log(req.body);
    await Management.findOne({ email: newManagement.email })
        .then(async profile => {
            if (!profile) {
                await newManagement
                    .save()
                    .then(() => {
                        res.status(200).send(newManagement);
                    })
                    .catch(err => {
                        console.log("Error is ", err.message);
                    });
            }
            else {
                res.send("User already exists...");
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
        });

});

router.get('/management/:userid', async (req, res) => {
    try {
        const book = await Management.findOne({ userid: req.params.userid, userId: req.user && req.user.id });
        res.json(book);
    } catch (err) {
        res.json({ error: err.message || err.toString() });
    }
});


router.post("/class",  async (req, res) => {
    
    var newClasses = new Classes({
        classid:1 ,
        class: req.body.class,
        sections:[{
            section: req.body.section,
            noofstudent: req.body.noofstudent,

        }],
        noofstudent: req.body.noofstudent,
        subject:req.body.subject,
        subjectid:2,
        chapter: req.body.chapter,
        topic: req.body.topic,
       

    });
    console.log(req.body);
    await Classes.findOne({ class: newClasses.class })
        .then(async profile => {
            if (!profile) {
                newClasses.classid = "CLS" + Math.floor(1000 + Math.random() * 9000);
                newClasses.subjectid = "SUB" + Math.floor(1000 + Math.random() * 9000);
                await newClasses
                    .save()
                    .then(() => {
                        res.status(200).send(newClasses);
                    })
                    .catch(err => {
                        console.log("Error is ", err.message);
                    });
            }
            else {
                res.send("User already exists...");
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
        });

});



module.exports = router;
