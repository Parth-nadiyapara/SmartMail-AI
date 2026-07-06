const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");

const passport = require("./config/passport");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* ===========================
   Global Middlewares
=========================== */

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ===========================
   Session
=========================== */

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

/* ===========================
   Passport
=========================== */

app.use(passport.initialize());

app.use(passport.session());

/* ===========================
   Routes
=========================== */

app.use("/api/v1/health", healthRoutes);

app.use("/api/v1/auth", authRoutes);

/* ===========================
   Root Route
=========================== */

app.get("/", (req, res) => {

    res.json({
        message: "SmartMail AI Backend Running"
    });

});

/* ===========================
   Error Handling
=========================== */

app.use(notFound);

app.use(errorHandler);

module.exports = app;