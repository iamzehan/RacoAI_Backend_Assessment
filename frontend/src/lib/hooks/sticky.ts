import { useEffect, useRef, useState } from "react";

export function useIsSticky<T extends HTMLElement>(top = 0) {
  const ref = useRef<T>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      setIsSticky(rect.top <= top);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [top]);

  return { ref, isSticky };
}