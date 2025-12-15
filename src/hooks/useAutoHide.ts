import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAutoHideOptions {
  delay?: number; // milliseconds before hiding
  enabled?: boolean;
}

export function useAutoHide({ delay = 3000, enabled = true }: UseAutoHideOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (!enabled) return;
    
    setIsVisible(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, delay);
  }, [enabled, delay]);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      return;
    }

    // Start the timer on mount
    resetTimer();

    // Add mouse move listener
    const handleMouseMove = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, resetTimer]);

  return { isVisible, resetTimer };
}

