import { motion } from 'framer-motion';
import { useTimer } from '../../hooks/useTimer';
import { usePhaseStore } from '../../store/phaseStore';
import { formatTime } from '../../utils/timeUtils';
import { useEffect, useState, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

export function TimerDisplay() {
  const { timeRemaining, isRunning } = useTimer();
  const { currentPhase } = usePhaseStore();
  const { playEndTimer } = useSound();
  const [isLow, setIsLow] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const isNight = currentPhase === 'NIGHT';
  const previousTimeRef = useRef(timeRemaining);
  const previousRunningRef = useRef(isRunning);

  useEffect(() => {
    setIsLow(timeRemaining <= 30 && timeRemaining > 10);
    setIsCritical(timeRemaining <= 10);
  }, [timeRemaining]);

  useEffect(() => {
    // Only play sound when timer transitions from running to stopped at 0
    // This means it completed naturally, not from a reset
    const wasRunning = previousRunningRef.current;
    const wasNotZero = previousTimeRef.current > 0;
    const isNowZero = timeRemaining === 0;
    const isNowStopped = !isRunning;

    if (wasRunning && wasNotZero && isNowZero && isNowStopped && !hasPlayedSound) {
      playEndTimer();
      setHasPlayedSound(true);
    }

    // Reset flag when timer moves away from 0
    if (timeRemaining > 0) {
      setHasPlayedSound(false);
    }

    // Update refs
    previousTimeRef.current = timeRemaining;
    previousRunningRef.current = isRunning;
  }, [timeRemaining, isRunning, playEndTimer, hasPlayedSound]);

  const formattedTime = formatTime(timeRemaining);

  return (
    <div className="flex justify-center my-[2%]">
      <motion.h1
        className="text-[17vw] font-xanh-mono text-clocktower-text"
        animate={
          isCritical && !isNight
            ? {
                scale: [1, 1.05, 1],
                color: ['rgba(245, 245, 245, 0.97)', 'rgb(177, 36, 36)', 'rgba(245, 245, 245, 0.97)'],
              }
            : isLow && !isNight
            ? {
                scale: [1, 1.02, 1],
              }
            : {}
        }
        transition={
          isCritical && !isNight
            ? { duration: 1, repeat: Infinity }
            : isLow && !isNight
            ? { duration: 1, repeat: Infinity }
            : {}
        }
        style={{
          visibility: isNight ? 'hidden' : 'visible',
        }}
      >
        {formattedTime}
      </motion.h1>
    </div>
  );
}

