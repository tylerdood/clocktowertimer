import { motion, AnimatePresence } from 'framer-motion';
import { TimerControls } from '../Timer/TimerControls';
import { useAutoHide } from '../../hooks/useAutoHide';

export function ControlPanel() {
  const { isVisible } = useAutoHide({ delay: 3000, enabled: true });

  return (
    <div className="h-[60px] flex items-center justify-center mb-1">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="flex flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <TimerControls />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
