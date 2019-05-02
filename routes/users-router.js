var express = require("express");
var router = express.Router();
const db = require("../DB/db");
db.sequelize.sync();

const cors = require("cors");
router.use(cors());

//data-tables required
const AllUsers = require("../models/users");

// End points
router.get("/usersession", async (req, res) => {
  
  if (req.session.LoggedIn) {//find existing session

    AllUsers.findAll({//find specific user
      where: {
        id: req.session.userid,
        username: req.session.firstname
      }
    })
      .then(user => {
        if (user.length != 0) {

          let usersession = {};

          usersession.userid = user[0].id;
          usersession.firstname = user[0].firstname;
          usersession.LoggedIn = 1;

          res.json(usersession);
          console.log("user's session exists");
        } else {
          res.json({ LoggedIn: 0 });
          req.session.destroy();
          console.log("no such user");
        }
      })
      .catch(err => {
        res.json({ LoggedIn: 0 });
        console.log(err);
        console.log("no such user");
      });
  } else {
    res.json({ LoggedIn: 0 });
    console.log("no session available");
  }
});

router.post("/signup", async (req, res) => {

  let response = {};
  let signupObj = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.first_name,
    lastname: req.body.last_name,
  };

  AllUsers.create(signupObj)
    .then(signedUpUser => {

      req.session.userid = signedUpUser.id;
      req.session.firstname = signedUpUser.firstname;
      req.session.LoggedIn = 1;

      response.userid = signedUpUser.id;
      response.firstname = signedUpUser.firstname;
      response.isAdmin = 0;
      response.msg = "User has signed-up";

      res.json(response);
    })
    .catch(err => {
      req.session.LoggedIn = 0;
      response.error = err;
      res.json(err);
      console.log("Sign-up failed, please try again");
    });
});

router.post("/signin", async (req, res) => {

  let response = {};
  let signedinObj = [];

  if (req.body.usernameSignin == "Yossi" && req.body.passwordSignin == "123") {

    AllUsers.findAll({ //find admin and start his session
      where: {
        username: req.body.usernameSignin,
        password: req.body.passwordSignin
      }
    })
      .then(admin => {
        req.session.userid = admin[0].id;
        req.session.firstname = admin[0].firstname;
        req.session.LoggedIn = 1;
        req.session.isAdmin = 1;

        response.userid = admin[0].id;
        response.firstname = admin[0].firstname;
        response.isAdmin = 1;

        signedinObj.push(response);
        res.json(signedinObj);
        console.log("Admin has signed-in");
      })
      .catch(err => {
        res.json([]);
        console.log(err);
      })
  }

  else {
    AllUsers.findAll({ //find user and start his session
      where: {
        username: req.body.usernameSignin,
        password: req.body.passwordSignin
      }
    })
      .then(user => {
        if (user.length != 0) {
          req.session.userid = user[0].id;
          req.session.firstname = user[0].firstname;
          req.session.LoggedIn = 1;

          response.userid = user[0].id;
          response.firstname = user[0].firstname;
          response.isAdmin = 0;
          response.LoggedIn=1;

          signedinObj.push(response);
          res.json(signedinObj);
          console.log("User has signed-in");

        } else { //no user, session destroyed
          req.session.destroy();
          res.json(signedinObj);
          console.log("User not found");
        }
      })
      .catch(err => {
        res.json(signedinObj);
        console.log(err);
      });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.json({ status: "logged-out" });
  console.log("User has logged out");
})

router.get("/", async (res) => {
  AllUsers.findAll({})
    .then(allusers => {
      res.json(allusers);
    })
    .catch(err => {
      res.json(err);
      console.log("get users failed");
    });
});

module.exports = router;
