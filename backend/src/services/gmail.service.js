const { google } = require("googleapis");

const { mapEmail } = require("../mappers/email.mapper");

/**
 * Creates an authenticated Gmail client
 * for the currently logged-in user.
 */
const getGmailClient = (accessToken) => {

    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({
        access_token: accessToken
    });

    return google.gmail({
        version: "v1",
        auth: oauth2Client
    });

};

/**
 * Fetch the latest emails from Gmail.
 */
const getInboxEmails = async (accessToken) => {

    const gmailClient = getGmailClient(accessToken);

    // Fetch latest email IDs
    const response = await gmailClient.users.messages.list({
        userId: "me",
        maxResults: 10
    });

    const messages = response.data.messages || [];

    const emails = [];

    // Fetch complete details for each email
    for (const message of messages) {

        const email = await gmailClient.users.messages.get({
            userId: "me",
            id: message.id
        });

        emails.push(
            mapEmail(email.data)
        );

    }

    return emails;

};

/**
 * Fetch a single email by its Gmail message ID.
 * Used for on-demand AI analysis.
 */
const getEmailById = async (accessToken, messageId) => {

    const gmailClient = getGmailClient(accessToken);

    const response = await gmailClient.users.messages.get({
        userId: "me",
        id: messageId
    });

    return mapEmail(response.data);

};

module.exports = {
    getGmailClient,
    getInboxEmails,
    getEmailById
};