import { useEffect, useRef, useState, useCallback } from 'react';

export const useCountdown = (duration: number, startTime: string) => {
  const endTimestamp = new Date(startTime).getTime() + duration * 1000;
  const [remaining, setRemaining] = useState(endTimestamp - Date.now());
  const rafRef = useRef<number>(null);

  const update = useCallback(() => {
    const diff = endTimestamp - Date.now();
    setRemaining(diff > 0 ? diff : 0);
    if (diff > 0) {
      rafRef.current = requestAnimationFrame(update);
    }
  }, [endTimestamp]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [update]);

  return remaining;
};