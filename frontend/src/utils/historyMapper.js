export function historyRowToAnalysis(row) {
  if (!row) return null;
  return {
    summary: row.summary,
    priority: row.priority,
    category: row.category,
    urgencyScore: row.urgency_score,
    deadline: row.deadline,
    requiresReply: row.requires_reply,
    actionItems: row.action_items || [],
    recommendations: row.recommendations || [],
    replySuggestion: row.reply_suggestion,
  };
}
