import { useEffect, useRef, useState } from "react";

export function usePauseState(delay: number = 7000) {
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const pause = (temp = false) => {
    setIsPaused(true);
    clear();
    if (temp) {
      timeoutRef.current = window.setTimeout(() => {
        setIsPaused(false);
        timeoutRef.current = null;
      }, delay);
    }
  };

  const resume = () => {
    setIsPaused(false);
    clear();
  };

  useEffect(() => clear, []);
  return { isPaused, pause, resume };
}
