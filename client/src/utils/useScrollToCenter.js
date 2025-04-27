import { useEffect } from "react";

export const useScrollToCenter = (ref) => {
  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollTo = elementTop - (viewportHeight / 2 - elementHeight / 2);

      window.scrollTo({ top: scrollTo, behavior: "smooth" });
    }
  }, [ref]);
};
