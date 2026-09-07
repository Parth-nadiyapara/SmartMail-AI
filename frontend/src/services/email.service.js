import { api } from "./api";

/**
 * Fetches the inbox from the real Gmail-backed endpoint.
 * Returns the raw array of mapped emails from backend/src/mappers/email.mapper.js:
 * { id, threadId, from, to, subject, date, snippet, body, labels, isRead, isImportant, hasAttachments }
 */
export async function getInboxEmails() {
  const emails = await api.get("/api/v1/emails");
  return emails || [];
}

export function findEmailById(emails, id) {
  return emails.find((email) => email.id === id) || null;
}
