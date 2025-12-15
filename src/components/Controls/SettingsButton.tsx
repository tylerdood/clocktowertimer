import { motion } from 'framer-motion';

interface SettingsButtonProps {
  onOpenSettings: () => void;
}

export function SettingsButton({ onOpenSettings }: SettingsButtonProps) {
  return (
    <motion.div
      className="absolute top-4 right-4 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onOpenSettings}
        title="Settings"
        className="bg-transparent border-none cursor-pointer text-white hover:text-clocktower-gold transition-colors text-xl h-[30px] px-3 py-[10px] flex items-center justify-center"
      >
        <i className="fas fa-cog"></i>
      </button>
    </motion.div>
  );
}

