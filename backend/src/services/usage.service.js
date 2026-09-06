const supabase = require("../config/supabase");


/**
 * Get today's analysis usage for a user.
 */
const getDailyUsage = async (userId) => {
    const today = new Date()
        .toISOString()
        .split("T")[0];

    const { data, error } = await supabase
        .from("daily_usage")
        .select("analysis_count, usage_date")
        .eq("user_id", userId)
        .eq("usage_date", today)
        .maybeSingle();

    if (error) {
        console.error(
            "Supabase daily usage fetch error:",
            error
        );

        throw new Error(
            "Failed to fetch daily usage."
        );
    }

    return {
        usageDate: today,
        analysisCount:
            data?.analysis_count || 0,
    };
};


/**
 * Check whether the user can perform another analysis.
 */
const checkAnalysisLimit = async (
    userId,
    dailyAnalysisLimit
) => {

    const usage =
        await getDailyUsage(userId);

    return {
        allowed:
            usage.analysisCount <
            dailyAnalysisLimit,

        analysisCount:
            usage.analysisCount,

        dailyAnalysisLimit,

        remaining:
            Math.max(
                dailyAnalysisLimit -
                usage.analysisCount,
                0
            ),

        usageDate:
            usage.usageDate,
    };
};


/**
 * Atomically increment today's analysis usage.
 *
 * This calls the PostgreSQL function:
 *
 * public.increment_analysis_usage
 *
 * The database function makes the increment
 * safe against concurrent requests.
 *
 * IMPORTANT:
 * This function should be called ONLY
 * after the AI analysis succeeds.
 */
const incrementAnalysisUsage = async (
    userId
) => {

    const { data, error } =
        await supabase.rpc(
            "increment_analysis_usage",
            {
                p_user_id: userId,
            }
        );


    if (error) {

        console.error(
            "Supabase atomic usage error:",
            error
        );

        throw new Error(
            "Failed to update daily usage."
        );
    }


    if (!data || data.length === 0) {

        throw new Error(
            "Invalid usage response."
        );
    }


    return data[0];
};


module.exports = {
    getDailyUsage,
    checkAnalysisLimit,
    incrementAnalysisUsage,
};