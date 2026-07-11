/**
 * Extract the email body
 * from the gmail payload.
 */

const extractEmailBody = (payload) => {
    
    //case-1: Body exists directly
    if (payload.body?.data) {
        return payload.body.data;
    }

    //case-2: Search inside the body parts
    if (payload.parts) {
        
        for (const part of payload.parts) {

            const body = extractEmailBody(part);
            if (body) {
                return body;
            }

        }
    }

    return "";

};

module.exports = {
    extractEmailBody
};