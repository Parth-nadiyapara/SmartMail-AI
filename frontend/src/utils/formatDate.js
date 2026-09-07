/**
 * Gmail's `date` header and Supabase's `received_at` / `created_at`
 * columns aren't always the same shape, so this parses defensively
 * and falls back gracefully instead of throwing.
 */
function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatRelativeOrDate(value) {
  const date = toDate(value);
  if (!date) return "";

  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.round(diffMs / 60000);
  const diffHr = Math.round(diffMs / 3600000);
  const diffDay = Math.round(diffMs / 86400000);

  const isToday = date.toDateString() === now.toDateString();

  if (diffMin < 1) return "Just now";
  if (isToday && diffMin < 60) return `${diffMin}m ago`;
  if (isToday && diffHr < 24)
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7)
    return date.toLocaleDateString(undefined, { weekday: "short" });

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatFullDateTime(value) {
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
