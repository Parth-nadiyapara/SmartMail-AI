const express = require("express");

const {
    getHistory,
    getHistoryByMessageId,
} = require("../controllers/analysis-history.controller");

const router = express.Router();


router.get(
    "/",
    getHistory
);


router.get(
    "/:id",
    getHistoryByMessageId
);


module.exports = router;