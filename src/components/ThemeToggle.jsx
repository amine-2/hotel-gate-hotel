import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved === "dark";

    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggle() {
    const next = !isDark;

    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-300 hover:text-zinc-900  transition cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}