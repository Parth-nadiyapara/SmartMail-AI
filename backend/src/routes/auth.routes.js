const express = require("express");

const passport = require("passport");

const { googleCallback } = require("../controllers/auth.controller");

const router = express.Router();

/**
 * Login with Google
 */

router.get(
    "/google",
    passport.authenticate("google", {
        scope: [
            "profile",
            "email",
            "https://www.googleapis.com/auth/gmail.readonly"
        ]
    })
);

/**
 * Google callback
 */

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/"
    }),
    googleCallback
);

module.exports = router;