const express = require("express");
const passport = require("passport");

const {
    analyzeEmailController,
} = require("../controllers/analysis.controller");

const router = express.Router();

router.post(
    "/:id",
    passport.authenticate("session", {
        failureRedirect: "/api/v1/auth/google",
    }),
    analyzeEmailController
);

module.exports = router;