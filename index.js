var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require('cors');
var passport = require("passport");
var db = require("./mysetup/myurl").myurl;
var User = require("./routes/user");




var app = express();
app.use(cors());


var port = process.env.PORT || 8000;




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose
   .connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
   })
   .then(() => {
      console.log("Database is connected");
   })
   .catch(err => {
      console.log("Error is ", err.message);
   });


app.use(passport.initialize());

app.use('/uploads',express.static('uploads'));


require("./strategies/jsonwtStrategy")(passport);

app.get("/", (req, res) => {
   res.status(200).send(`Hi Welcome to the Login and Signup API`);
});


const profile = require("./routes/User");
app.use("/api", profile);



app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
   });



