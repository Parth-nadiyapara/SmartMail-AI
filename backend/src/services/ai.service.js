const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const AI_SERVICE_TIMEOUT_MS = Number(
    process.env.AI_SERVICE_TIMEOUT_MS || 45000
);

const analyzeWithPython = async (emailBody) => {
    if (!emailBody || emailBody.trim() === "") {
        throw new Error("Email body is empty.");
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, AI_SERVICE_TIMEOUT_MS);

    try {
        let response;

        try {
            response = await fetch(
                `${AI_SERVICE_URL}/analyze`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        emailBody,
                    }),
                    signal: controller.signal,
                }
            );
        } catch (error) {
            if (error.name === "AbortError") {
                const timeoutError = new Error(
                    "AI service request timed out."
                );

                timeoutError.statusCode = 504;

                throw timeoutError;
            }

            const serviceError = new Error(
                "AI service is unavailable."
            );

            serviceError.statusCode = 503;

            throw serviceError;
        }

        let data;

        try {
            data = await response.json();
        } catch (error) {
            const invalidResponseError = new Error(
                "AI service returned an invalid response."
            );

            invalidResponseError.statusCode = 502;

            throw invalidResponseError;
        }

        if (!response.ok) {
            const serviceError = new Error(
                data.detail ||
                data.message ||
                "AI service failed to analyze the email."
            );

            serviceError.statusCode =
                response.status >= 500
                    ? 502
                    : response.status;

            throw serviceError;
        }

        if (!data.success || !data.data) {
            const invalidResponseError = new Error(
                "AI service returned an incomplete analysis."
            );

            invalidResponseError.statusCode = 502;

            throw invalidResponseError;
        }

        return data.data;

    } finally {
        clearTimeout(timeout);
    }
};

const summarizeEmail = async (emailBody) => {
    return analyzeWithPython(emailBody);
};

module.exports = {
    summarizeEmail,
};