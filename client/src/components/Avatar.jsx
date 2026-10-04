function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-xs sm:h-10 sm:w-10 sm:text-sm",
  lg: "h-16 w-16 text-xl sm:h-20 sm:w-20 sm:text-2xl",
};

export default function Avatar({ name, avatarUrl, size = "sm", className = "" }) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.sm;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "Profile"}
        className={`${sizeClass} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-coral/10 font-semibold text-coral ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
