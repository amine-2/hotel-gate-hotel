import { useState, useEffect, useRef } from "react";
import i18n from "../i18n";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const ref = useRef();

  useEffect(() => {
    const saved = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(saved);
    setCurrent(saved);
  }, []);

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setCurrent(lang);
    setOpen(false);
  }

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Icon button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-700 cursor-pointer 
        dark:text-zinc-300 dark:hover:bg-zinc-300 
        dark:hover:text-zinc-900 transition"
        title="Switch Language"
      >
        <Languages size={20} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-28 dark:bg-zinc-800 dark:border-zinc-600
         dark:text-zinc-300 border border-zinc-700 rounded-lg shadow-lg"
        >
          <button
            onClick={() => changeLanguage("en")}
            className={`w-full text-left px-3 py-2 hover:bg-zinc-100 ${
              current === "en" ? "text-orange-500" : ""
            }`}
          >
            English
          </button>

          <button
            onClick={() => changeLanguage("fr")}
            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 ${
              current === "fr" ? "text-orange-500" : ""
            }`}
          >
            Français
          </button>
        </div>
      )}
    </div>
  );
}
