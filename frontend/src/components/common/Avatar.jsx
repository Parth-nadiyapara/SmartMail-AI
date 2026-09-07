function initials(name, email) {
  const source = name || email || "?";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

export function Avatar({ name, email, photo, size = 36, className = "" }) {
  const dimension = { width: size, height: size };

  if (photo) {
    return (
      <img
        src={photo}
        alt={name || email || "User avatar"}
        style={dimension}
        className={`rounded-full object-cover shrink-0 ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      style={dimension}
      className={`rounded-full bg-brand-blue text-white flex items-center justify-center font-medium shrink-0 ${className}`}
    >
      <span style={{ fontSize: size * 0.4 }}>{initials(name, email)}</span>
    </div>
  );
}
