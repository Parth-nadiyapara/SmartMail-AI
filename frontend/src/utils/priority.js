import {
  Briefcase,
  User,
  Wallet,
  GraduationCap,
  Users,
  Megaphone,
  ShieldAlert,
  Tag,
} from "lucide-react";

/**
 * Maps the backend's `priority` enum (Low | Medium | High) to the
 * Google-inspired accent colors. Color is never the only signal —
 * every badge also renders the text label (accessibility, section 48).
 */
export const PRIORITY_STYLES = {
  High: {
    label: "HIGH",
    dot: "bg-brand-red",
    text: "text-brand-red",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-900",
  },
  Medium: {
    label: "MEDIUM",
    dot: "bg-brand-yellow",
    text: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-900",
  },
  Low: {
    label: "LOW",
    dot: "bg-brand-green",
    text: "text-brand-green",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-900",
  },
};

export function getPriorityStyle(priority) {
  return PRIORITY_STYLES[priority] || PRIORITY_STYLES.Low;
}

/**
 * Maps the backend's `category` enum to an icon. Purely a visual aid;
 * the text label is always shown alongside it.
 */
export const CATEGORY_ICONS = {
  Work: Briefcase,
  Personal: User,
  Finance: Wallet,
  Education: GraduationCap,
  Social: Users,
  Promotion: Megaphone,
  Security: ShieldAlert,
  Other: Tag,
};

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || Tag;
}

export function urgencyBarColor(score) {
  if (score >= 70) return "bg-brand-red";
  if (score >= 40) return "bg-brand-yellow";
  return "bg-brand-green";
}
