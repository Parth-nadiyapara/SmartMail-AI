const { getEmailById } = require("./gmail.service");
const { summarizeEmail } = require("./ai.service");

const analyzeEmail = async (accessToken, messageId) => {
    const email = await getEmailById(accessToken, messageId);

    if (!email) {
        throw new Error("Email not found.");
    }

    if (!email.body || email.body.trim() === "") {
        throw new Error("Email body is empty.");
    }

    const analysis = await summarizeEmail(email.body);

    return {
        email,
        analysis,
    };
};

module.exports = {
    analyzeEmail,
};