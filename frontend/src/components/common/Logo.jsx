/**
 * Original SmartMail AI mark: a rounded envelope combined with an
 * AI sparkle, using the four Google-inspired accent colors as small
 * highlights rather than a full-color fill. Intentionally NOT a
 * reproduction of the Gmail "M" — see spec section 21.
 */
function Mark({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" className="fill-ink dark:fill-dark-surface2" />
      <path
        d="M9 15a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V15Z"
        fill="white"
      />
      <path
        d="M9.6 14.3 21 23l11.4-8.7"
        stroke="#4285F4"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M37.5 8.5 39 12l3.5 1.5L39 15l-1.5 3.5L36 15l-3.5-1.5L36 12l1.5-3.5Z"
        fill="#FBBC05"
      />
      <path
        d="M38.5 24.8 39.4 27l2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9.9-2.2Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LogoFull({ size = 28, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Mark size={size} />
      <span className="font-semibold text-[17px] tracking-tight text-ink dark:text-dark-text whitespace-nowrap">
        SmartMail <span className="text-brand-blue">AI</span>
      </span>
    </div>
  );
}

export function LogoCompact({ size = 28, className = "" }) {
  return (
    <div className={className}>
      <Mark size={size} />
    </div>
  );
}
