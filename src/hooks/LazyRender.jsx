import { useEffect, useRef, useState } from "react";

export default function LazyRender({
  children,
  className = "",
  once = true,
  threshold = 1,
  rootMargin = "0px",
  placeholder = null,
  minHeight = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const el = ref.current;

    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [once, threshold, rootMargin]);

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {visible ? children : placeholder}
    </div>
  );
}