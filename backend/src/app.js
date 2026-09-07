const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");

const gmailRoutes = require("./routes/gmail.routes");
const analysisRoutes = require("./routes/analysis.routes");

const analysisHistoryRoutes =
   require("./routes/analysis-history.routes");

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

app.use(
   cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
   })
);

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ===========================
   Session
=========================== */

app.set("trust proxy", 1);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        }
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

app.use("/api/v1/emails", gmailRoutes);

app.use("/api/v1/analysis", analysisRoutes);

app.use(
   "/api/v1/analysis-history",
   analysisHistoryRoutes
);

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