const { convert } = require("html-to-text");

/**
 * Converts HTML email to plain text.
 */

const cleanHtml = (html) => {
    if (!html) {
        return "";
    }

    return convert(html, {
        wordwrap: false,

        selectors: [
            { selector: "img", format: "skip" },
            { selector: "style", format: "skip" },
            { selector: "script", format: "skip" }
        ]
    })
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};

module.exports = {
    cleanHtml
};