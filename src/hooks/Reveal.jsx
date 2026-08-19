import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  y = 40,
  duration = 0.6,
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
        className={className}
    >
      {children}
    </motion.div>
  );
}