const {
    getEmailById
} = require("./gmail.service");

const {
    summarizeEmail
} = require("./ai.service");

const {
    checkAnalysisLimit,
    incrementAnalysisUsage,
    getDailyUsage
} = require("./usage.service");

const {
    saveAnalysis,
    getAnalysisByMessageId
} = require("./analysis-history.service");


const analyzeEmail = async (
    accessToken,
    messageId,
    user
) => {

    if (!user || !user.databaseId) {

        const error = new Error(
            "Authenticated database user is required."
        );

        error.statusCode = 401;

        throw error;
    }


    /*
     * 1. Check whether this email was already analyzed.
     *
     * Cached analysis does NOT consume daily usage.
     */
    const existingAnalysis =
        await getAnalysisByMessageId(
            user.databaseId,
            messageId
        );


    if (existingAnalysis) {

        const currentUsage =
            await getDailyUsage(
                user.databaseId
            );


        return {

            email: {
                id:
                    existingAnalysis.gmail_message_id,

                subject:
                    existingAnalysis.subject,

                from:
                    existingAnalysis.sender,

                date:
                    existingAnalysis.received_at
            },

            analysis: {

                summary:
                    existingAnalysis.summary,

                priority:
                    existingAnalysis.priority,

                category:
                    existingAnalysis.category,

                urgencyScore:
                    existingAnalysis.urgency_score,

                deadline:
                    existingAnalysis.deadline,

                requiresReply:
                    existingAnalysis.requires_reply,

                actionItems:
                    existingAnalysis.action_items || [],

                recommendations:
                    existingAnalysis.recommendations || [],

                replySuggestion:
                    existingAnalysis.reply_suggestion
            },

            history:
                existingAnalysis,

            usage: {

                analysisCount:
                    currentUsage.analysisCount,

                dailyAnalysisLimit:
                    user.dailyAnalysisLimit,

                remaining:
                    Math.max(
                        user.dailyAnalysisLimit -
                        currentUsage.analysisCount,
                        0
                    )
            },

            cached: true
        };
    }


    /*
     * 2. Check daily analysis limit.
     *
     * Only NEW analyses consume the limit.
     */
    const limitStatus =
        await checkAnalysisLimit(
            user.databaseId,
            user.dailyAnalysisLimit
        );


    if (!limitStatus.allowed) {

        const error = new Error(
            `Daily analysis limit reached. You have used ${limitStatus.analysisCount} of ${limitStatus.dailyAnalysisLimit} analyses today.`
        );

        error.statusCode = 429;

        error.code =
            "DAILY_ANALYSIS_LIMIT_REACHED";

        throw error;
    }


    /*
     * 3. Fetch email from Gmail.
     */
    const email =
        await getEmailById(
            accessToken,
            messageId
        );


    /*
     * 4. Analyze email using Python + Gemini.
     */
    const analysis =
        await summarizeEmail(
            email.body
        );


    /*
     * 5. Save successful analysis.
     */
    const savedAnalysis =
        await saveAnalysis({

            userId:
                user.databaseId,

            email,

            analysis,

        });


    /*
     * 6. Increment usage ONLY after
     * successful AI analysis + history save.
     */
    const usage =
        await incrementAnalysisUsage(
            user.databaseId
        );


    /*
     * 7. Return fresh analysis.
     */
    return {

        email,

        analysis,

        history:
            savedAnalysis,

        usage: {

            analysisCount:
                usage.analysis_count,

            dailyAnalysisLimit:
                user.dailyAnalysisLimit,

            remaining:
                Math.max(
                    user.dailyAnalysisLimit -
                    usage.analysis_count,
                    0
                )
        },

        cached: false
    };
};


module.exports = {
    analyzeEmail
};