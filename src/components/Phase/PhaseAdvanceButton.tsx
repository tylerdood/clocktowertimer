import { motion } from 'framer-motion';
import { usePhase } from '../../hooks/usePhase';
import { usePhaseStore } from '../../store/phaseStore';

export function PhaseAdvanceButton() {
  const { advance } = usePhase();
  const { currentPhase } = usePhaseStore();

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'DAY':
        return 'fas fa-cloud';
      case 'ENDOFDAY':
        return 'fas fa-moon';
      case 'NIGHT':
        return 'fas fa-sun';
    }
  };

  const getButtonText = () => {
    switch (currentPhase) {
      case 'DAY':
        return 'End of Day';
      case 'ENDOFDAY':
        return 'Night';
      case 'NIGHT':
        return 'Day';
    }
  };

  return (
    <motion.button
      onClick={advance}
      title="Advance to next phase"
      className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 hover:border-white rounded-lg px-6 py-3 font-almendra text-lg transition-all duration-200 flex items-center gap-3 backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <i className={getPhaseIcon()}></i>
      <span>{getButtonText()}</span>
    </motion.button>
  );
}

