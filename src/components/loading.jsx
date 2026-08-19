import { useEffect, useState } from "react";
import "./loading.css";
import lightLogo from '../assets/logo.svg'
import darkLogo from '../assets/dark-logo.svg' 


export default function LoaderPage() {
  const [lines, setLines] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  
  

  useEffect(() => {
    // Generate random animation values once
    const generated = Array.from({ length: 3 }).map(() => ({
      x: Math.random() * 80 - 40,
      y: Math.random() * 80 - 40,
      rotate: Math.random() * 360,
      duration: 6 + Math.random() * 4
    }));
    const isDark = localStorage.getItem("theme") === "dark";
      setDarkMode(isDark);

    setLines(generated);
  }, []);

  
  

  return (
    <div className="loader-root bg-white dark:bg-zinc-900">
      {/* Background lines */}
      {lines.map((line, i) => (
        <div
          key={i}
          className={`loader-line line${i}`}
          style={{
            "--x": `${line.x*10}px`,
            "--y": `${line.y*10}px`,
            "--r": `${line.rotate}deg`,
            "--d": `${line.duration*2}s`
          }}
        />
      ))}

      {/* Logo */}
      <div className="loader-logo">
        <img src={darkMode ? darkLogo : lightLogo} alt="React" />
        <h2 className="text-2xl font-light italic">Hotel</h2>
      </div>
    </div>
  );
}
