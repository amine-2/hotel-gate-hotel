import { useEffect, useRef, useState } from "react";

export default function useCountUp(target, duration = 1500, animateOnce = false) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if ((entry.isIntersecting && !hasAnimated.current) || !animateOnce) {
          if (animateOnce) hasAnimated.current = true;

          let start = 0;
          const startTime = performance.now();

          const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);

            const value = Number((easedProgress * target).toFixed(0));
            setCount(value);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [target, duration, animateOnce]);

  return { count, ref };
}