const express = require("express");

const passport = require("passport");

const {
    getEmails
} = require("../controllers/gmail.controller");

const router = express.Router();

/**
 * Get latest Gmail emails
 */

router.get("/", 
    passport.authenticate("session", {
        failureRedirect: "/api/v1/auth/google"
}), 
 getEmails
);

module.exports = router;