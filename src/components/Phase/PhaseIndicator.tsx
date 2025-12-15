import { motion, AnimatePresence } from 'framer-motion';
import { usePhaseStore } from '../../store/phaseStore';

const phaseText = {
  DAY: 'Day',
  ENDOFDAY: 'End of Day',
  NIGHT: 'Night',
};

export function PhaseIndicator() {
  const { currentPhase, currentDay } = usePhaseStore();

  return (
    <div className="mt-[5%] text-center">
      <motion.div
        key={`${currentPhase}-${currentDay}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-4 text-4vw font-almendra"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {phaseText[currentPhase]}
          </motion.span>
        </AnimatePresence>
        <motion.span
          key={currentDay}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          {currentDay}
        </motion.span>
      </motion.div>
    </div>
  );
}

