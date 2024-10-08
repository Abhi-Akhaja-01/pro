const express =require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(wrapAsync(userController.renderSingupFrom))
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(wrapAsync(userController.renderLoginForm))
    .post(
    saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    }), wrapAsync(userController.login));


// router.get("/signup", wrapAsync(userController.renderSingupFrom));

// router.post("/signup", wrapAsync(userController.signup));

// router.get("/login", wrapAsync(userController.renderLoginForm));

// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//     }), wrapAsync(userController.login));

router.get("/logout", wrapAsync(userController.logout));

module.exports = router;