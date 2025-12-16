import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';

export function CharacterDisplays() {
  const {
    townsfolk,
    outsider,
    minion,
    demon,
    traveler,
  } = useCharacterStore();
  const [showTownsfolkEffect, setShowTownsfolkEffect] = useState(false);
  const [showEvilEffect, setShowEvilEffect] = useState(false);
  const [showTravelerEffect, setShowTravelerEffect] = useState(false);

  const handleTownsfolkClick = () => {
    setShowTownsfolkEffect(true);
    setTimeout(() => setShowTownsfolkEffect(false), 600);
  };

  const handleEvilClick = () => {
    setShowEvilEffect(true);
    setTimeout(() => setShowEvilEffect(false), 600);
  };

  const handleTravelerClick = () => {
    setShowTravelerEffect(true);
    setTimeout(() => setShowTravelerEffect(false), 600);
  };

  return (
    <div className="flex flex-row justify-center items-center gap-6 mb-4">
      <motion.div
        className="flex flex-row items-center gap-3 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTownsfolkClick}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <div className="relative">
          <img src="/images/townsfolk.png" alt="Townsfolk" className="w-[60px]" />
          <AnimatePresence>
            {showTownsfolkEffect && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                animate={{ opacity: 1, scale: 1.3, rotate: 360 }}
                exit={{ opacity: 0, scale: 1.8, rotate: 360 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <motion.div
                  className="text-blue-400 font-bold text-3xl"
                  style={{
                    textShadow: '0 0 10px rgba(96, 165, 250, 1), 0 0 20px rgba(96, 165, 250, 0.8), 0 0 30px rgba(96, 165, 250, 0.6)',
                  }}
                >
                  ✦
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.span
          key={`${townsfolk}-${outsider}`}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-blue-300 text-5xl font-bold drop-shadow-[0_0_4px_rgba(96,165,250,0.8)]"
        >
          {townsfolk} / {outsider}
        </motion.span>
      </motion.div>

      <motion.div
        className="flex flex-row items-center gap-3 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEvilClick}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <div className="relative">
          <img src="/images/evil.png" alt="Evil" className="w-[60px]" />
          <AnimatePresence>
            {showEvilEffect && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.3, rotate: -45 }}
                animate={{ opacity: 1, scale: 1.4, rotate: -45 }}
                exit={{ opacity: 0, scale: 2, rotate: -45 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <motion.div
                  className="text-red-500 font-bold text-3xl"
                  style={{
                    textShadow: '0 0 10px rgba(239, 68, 68, 1), 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(220, 38, 38, 0.6)',
                  }}
                >
                  ⚡
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.span
          key={`${minion}-${demon}`}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-red-400 text-5xl font-bold drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
        >
          {minion} / {demon}
        </motion.span>
      </motion.div>

      <motion.div
        className="flex flex-row items-center gap-3 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTravelerClick}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <div className="relative">
          <img src="/images/travelors.png" alt="Travelers" className="w-[60px]" />
          <AnimatePresence>
            {showTravelerEffect && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                animate={{ opacity: 1, scale: 1.3, rotate: 180 }}
                exit={{ opacity: 0, scale: 1.8, rotate: 360 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <motion.div
                  className="text-yellow-400 font-bold text-3xl"
                  style={{
                    textShadow: '0 0 10px rgba(250, 204, 21, 1), 0 0 20px rgba(250, 204, 21, 0.8), 0 0 30px rgba(234, 179, 8, 0.6)',
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.span
          key={traveler}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-yellow-300 text-5xl font-bold drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]"
        >
          {traveler}
        </motion.span>
      </motion.div>
    </div>
  );
}

