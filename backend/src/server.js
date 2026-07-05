require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`
=========================================
🚀 SmartMail AI Backend Started
🌍 Environment : ${process.env.NODE_ENV || "development"}
📡 Server      : http://localhost:${PORT}
=========================================
        `);
});