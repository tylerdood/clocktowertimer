import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';

export function useTimer() {
  const {
    timeRemaining,
    isRunning,
    defaultTime,
    startTimer,
    stopTimer,
    resetTimer,
    incrementTimer,
    decrementTimer,
    setTime,
    tick,
  } = useTimerStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, tick]);

  return {
    timeRemaining,
    isRunning,
    defaultTime,
    startTimer,
    stopTimer,
    resetTimer,
    incrementTimer,
    decrementTimer,
    setTime,
  };
}

