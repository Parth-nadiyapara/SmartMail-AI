const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const healthRoutes = require("./routes/health.routes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// --------------------------
// Global Middleware
// --------------------------

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// --------------------------
// API Routes
// --------------------------

app.use("/api/v1/health", healthRoutes);

// --------------------------
// Middleware
// --------------------------

app.use(notFound);

app.use(errorHandler);

module.exports = app;