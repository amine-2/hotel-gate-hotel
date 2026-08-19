import { useState } from "react";

export default function ExpandButton({
  icon,
  label,
  onClick,
  className = "",
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex items-center overflow-hidden rounded-lg transition-all duration-300 cursor-pointer ${className}`}
    >
      {/* Label */}
      <span
        className={`whitespace-nowrap transition-all duration-300 ${
          hover ? "max-w-50 opacity-100 mr-2" : "max-w-0 opacity-0"
        }`}
      >
        {label}
      </span>

      {/* Icon */}
      <span className="flex items-center justify-center">
        {icon}
      </span>
    </button>
  );
}