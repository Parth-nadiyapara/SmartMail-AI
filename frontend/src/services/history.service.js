import { api, ApiError } from "./api";

/**
 * Returns the full analysis history, most recent first (backend orders
 * by created_at desc). Each row is a raw Supabase `email_analyses` record:
 * gmail_message_id, subject, sender, received_at, summary, priority,
 * category, urgency_score, deadline, requires_reply, action_items,
 * recommendations, reply_suggestion, created_at, ...
 */
export async function getAnalysisHistory() {
  const history = await api.get("/api/v1/analysis-history");
  return history || [];
}

/**
 * Looks up a single stored analysis by Gmail message ID.
 * Returns null (not a thrown error) when nothing has been analyzed yet
 * for this email, since that's a normal, expected state in the UI.
 */
export async function getAnalysisByMessageId(messageId) {
  try {
    return await api.get(`/api/v1/analysis-history/${messageId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
