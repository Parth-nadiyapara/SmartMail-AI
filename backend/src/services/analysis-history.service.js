const supabase = require("../config/supabase");


/**
 * Save a successful email analysis.
 *
 * One Gmail email can have only one analysis
 * per user.
 */
const saveAnalysis = async ({
    userId,
    email,
    analysis,
}) => {

    const record = {
        user_id: userId,

        gmail_message_id:
            email.id,

        subject:
            email.subject || null,

        sender:
            email.from || null,

        received_at:
            email.date || null,

        summary:
            analysis.summary,

        priority:
            analysis.priority,

        category:
            analysis.category,

        urgency_score:
            analysis.urgencyScore,

        deadline:
            analysis.deadline || null,

        requires_reply:
            analysis.requiresReply,

        action_items:
            analysis.actionItems || [],

        recommendations:
            analysis.recommendations || [],

        reply_suggestion:
            analysis.replySuggestion || null,
    };


    const { data, error } = await supabase
        .from("email_analyses")
        .upsert(
            record,
            {
                onConflict:
                    "user_id,gmail_message_id",
            }
        )
        .select()
        .single();


    if (error) {

        console.error(
            "Supabase analysis save error:",
            error
        );

        throw new Error(
            "Failed to save email analysis."
        );
    }


    return data;
};


/**
 * Get analysis history for a user.
 */
const getAnalysisHistory = async (
    userId
) => {

    const { data, error } = await supabase
        .from("email_analyses")
        .select("*")
        .eq("user_id", userId)
        .order(
            "created_at",
            {
                ascending: false,
            }
        );


    if (error) {

        console.error(
            "Supabase analysis history error:",
            error
        );

        throw new Error(
            "Failed to fetch analysis history."
        );
    }


    return data || [];
};


/**
 * Get one analysis by Gmail message ID.
 */
const getAnalysisByMessageId = async (
    userId,
    messageId
) => {

    const { data, error } = await supabase
        .from("email_analyses")
        .select("*")
        .eq("user_id", userId)
        .eq(
            "gmail_message_id",
            messageId
        )
        .maybeSingle();


    if (error) {

        console.error(
            "Supabase analysis lookup error:",
            error
        );

        throw new Error(
            "Failed to fetch email analysis."
        );
    }


    return data;
};


module.exports = {
    saveAnalysis,
    getAnalysisHistory,
    getAnalysisByMessageId,
};