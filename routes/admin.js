var express = require("express");
var router = express.Router();
const { response } = require("../app");
const adminConnect = require("../helpers/adminconnect");
const userconnect = require("../helpers/userconnect");
/* GET home page. */

function authAdmin(req, res, next) {
  if (req.session.adminLoggin) {
    res.redirect("/admin/home");
  } else {
    next();
  }
}
function verifyAdmin(req, res, next) {
  if (req.session.adminLoggin) {
    next();
  } else {
    res.redirect("/admin/signin");
  }
}
router.get("/", authAdmin, verifyAdmin);
router.get("/signin", authAdmin, function (req, res, next) {
  res.render("admin/signin", {
    title: "admin",
    errmsg: req.session.error,
    admin: false,
  });
  req.session.error = null;
});
router.get("/home", verifyAdmin, function (req, res, next) {
  res.render("admin/home", { title: "admin", admin: req.session.admin });
});
router.get("/viewUsers", verifyAdmin, function (req, res, next) {
  userconnect.getAllUser().then((users) => {
    res.render("admin/alluser", { admin: req.session.admin, users });
  });
});
router.post("/signin", function (req, res, next) {
  adminConnect.doSignIn(req.body).then((response) => {
    console.log(response.status);
    if (response.status) {
      req.session.admin = response.admin;
      req.session.adminLoggin = true;
      res.redirect("/admin/home");
    } else {
      req.session.error = "Invalid Username or Password";
      res.redirect("/admin/signin");
    }
  });
});
router.delete("/deleteUser/:userId", verifyAdmin, function (req, res, next) {
  console.log("hai");
  adminConnect
    .deleteUser(req.params.userId)
    .then((response) => {
      if (response.status) {
        console.log("hai");
        res.sendStatus(204);
      } else {
        console.log("hai");

        res.status(400).json({ message: "unable to delete user" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});
var errmsg = null;
router.get("/adminEdit/:userId", verifyAdmin, function (req, res, next) {
  adminConnect.getUser(req.params.userId).then((response) => {
    console.log(response.user);
    if (response.status) {
      res.render("admin/adminedit", {
        admin: req.session.admin,
        user: response.user,
        err_msg: errmsg,
      });
    } else {
      res.redirect("/admin/viewUsers");
    }
  });
});
router.post("/adminEdit/:userId", verifyAdmin, function (req, res, next) {
  adminConnect.updateUser(req.params.userId, req.body).then((response) => {
    if (response) {
      res.redirect("/admin/viewUsers");
    } else {
      errmsg = "the data is not updated please try again";
      res.redirect("/admin/adminEdit");
    }
  });
});
router.get("/logout", function (req, res, next) {
  req.session.adminLoggin = null;
  req.session.admin = null;
  res.redirect("/");
});
router.get("/signup");
module.exports = router;
