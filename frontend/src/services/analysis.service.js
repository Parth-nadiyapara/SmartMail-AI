import { api } from "./api";

/**
 * Triggers analysis for a Gmail message ID via the backend.
 *
 * IMPORTANT: the backend response's `data` field is NOT the analysis
 * itself. It is an envelope containing:
 *   data.email     -> the analyzed email
 *   data.analysis  -> { summary, priority, category, urgencyScore,
 *                        deadline, requiresReply, actionItems,
 *                        recommendations, replySuggestion }
 *   data.usage     -> { analysisCount, dailyAnalysisLimit, remaining }
 *   data.history   -> the stored row for this analysis
 *   data.cached    -> true if this was a previously-analyzed email
 *                      (no daily quota was consumed)
 *
 * We return the envelope as-is so callers can destructure exactly
 * what they need, rather than flattening it and losing the
 * distinction between the email and its analysis.
 */
export async function analyzeEmail(messageId) {
  return api.post(`/api/v1/analysis/${messageId}`);
}
