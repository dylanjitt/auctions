import { useEffect, useRef, useState, useCallback } from 'react';

export const useCountdown = (duration: number, startTime: string) => {
  const [remaining, setRemaining] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Alternative implementation
useEffect(() => {
  const endTimestamp = new Date(startTime).getTime() + duration * 1000;
  
  const update = () => {
    const diff = endTimestamp - Date.now();
    setRemaining(Math.max(0, diff));
    
    if (diff > 0) {
      const timeout = setTimeout(update, 1000); // Update every second instead of every frame
      return () => clearTimeout(timeout);
    }
  };

  update();
}, [duration, startTime]);

  return remaining;
};

export const useAuction = () => {
  return { useCountdown };
};