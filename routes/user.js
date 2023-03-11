var express = require("express");
const { response } = require("../app");
var router = express.Router();
const userconnect = require("../helpers/userconnect");
/* GET users listing.d */
var errmsg = null;

function userauth(req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/home");
  } else {
    next();
  }
}
function verify(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/");
  }
}
router.get("/", userauth, function (req, res, next) {
  res.render("index", { title: "user" });
});
router.get("/home", verify, function (req, res, next) {
  if (req.session.loggedIn) {
    res.render("user/home", {
      title: "user",
      userName: req.session.user.fullName,
    });
  } else {
    res.render("index", { title: "user" });
  }
});
router.get("/signup", userauth, function (req, res, next) {
  res.render("user/signup", { title: "user", err_msg: errmsg });
  errmsg = null;
});
router.get("/signin", userauth, function (req, res, next) {
  res.render("user/signin", { title: "user", err_msg: errmsg });
  errmsg = null;
});
router.get("/logout", function (req, res, next) {
  req.session.loggedIn = null;
  req.session.user = null;
  res.redirect("/");
});
router.get("/useredit", verify, function (req, res, next) {
  res.render("user/useredit", {
    title: "user",
    userName: req.session.user.fullName,
    user: req.session.user,
    err_msg: errmsg,
  });
  errmsg = null;
});
router.get("/editPassword", verify, function (req, res, next) {
  res.render("user/changepassword", {
    title: "user",
    err_msg: errmsg,
    userName: req.session.user.fullName,
  });
  errmsg = null;
});
router.post("/editPassword", (req, res) => {
  userconnect
    .changePassword(req.body, req.session.user.email)
    .then((response) => {
      if (response) {
        res.redirect("/home");
      } else {
        res.redirect("/editPassword");
      }
    });
});
router.post("/useredit", (req, res) => {
  userconnect.userEdit(req.body, req.session.user.email).then((response) => {
    if (response.status) {
      req.session.user = response.user;
      res.redirect("/home");
    } else {
      errmsg = "the data is not updated please try again";
      res.redirect("/useredit");
    }
  });
});
router.post("/signup", (req, res) => {
  console.log(req.body);
  userconnect.doSignup(req.body).then((response) => {
    console.log(response);
    if (response.statuss) {
      console.log("IIII");
      res.redirect("/signin");
    } else {
      errmsg = "The email-Id already exists!!";
      res.redirect("/signup");
    }
  });
});
router.post("/signin", (req, res) => {
  userconnect.doSignin(req.body).then((response) => {
    if (response.status) {
      console.log("signed in");
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/home");
    } else {
      errmsg = "Invalid email or password !!";
      res.redirect("/signin");
    }
  });
});
module.exports = router;
