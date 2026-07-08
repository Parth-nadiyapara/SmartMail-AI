const { google } = require("googleapis");
/*
 * Returns the authenticated Gmail client.
 * for the currently logged in user.
 */

const getGmailClient = (accessToken) => {

    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({ access_token: accessToken });

    return google.gmail({
        version: "v1",
        auth: oauth2Client
    });
};

/* 
 * Fetch latest mails.
 */

const getInboxEmails = async (accessToken) => {

    const gmailClient = getGmailClient(accessToken);

    const response = await gmailClient.users.messages.list({
        userId: "me",
        maxResults: 10
    });

    return response.data.messages || [];
};


module.exports = {
    getGmailClient,
    getInboxEmails
};