/**
 * Maps Gmail API response
 * into SmartMail AI format.
 */
const { extractEmailBody } = require("../utils/emailBody");
const { cleanHtml } = require("../utils/htmlCleaner");

const mapEmail = (email) => {

    const headers = email.payload.headers || [];

    const getHeader = (name) => {
        return (
            headers.find(
                (header) => header.name === name
            )?.value || ""
        );
    };

    const bodyData = extractEmailBody(email.payload);

    const decodedBody = bodyData
        ? Buffer.from(bodyData, "base64")
            .toString("utf-8")
        : "";
    
    const body = cleanHtml(decodedBody);

    return {

        id: email.id,

        threadId: email.threadId,

        from: getHeader("From"),

        body,

        to: getHeader("To"),

        subject: getHeader("Subject"),

        date: getHeader("Date"),

        snippet: email.snippet,

        labels: email.labelIds || [],

        isRead: !(email.labelIds || []).includes("UNREAD"),

        isImportant:
            (email.labelIds || []).includes("IMPORTANT"),

        hasAttachments:
            email.payload.parts?.some(
                (part) => part.filename
            ) || false

    };

};

module.exports = {
    mapEmail
};