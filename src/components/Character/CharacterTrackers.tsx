import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { useSettingsStore } from '../../store/settingsStore';

export function CharacterTrackers() {
  const {
    townsfolk,
    outsider,
    minion,
    demon,
    traveler,
    heartCount,
    voteCount,
    increaseHeart,
    decreaseHeart,
    increaseVote,
    decreaseVote,
  } = useCharacterStore();
  const { featureRoles } = useSettingsStore();
  const [showDeathEffect, setShowDeathEffect] = useState(false);
  const [showTownsfolkEffect, setShowTownsfolkEffect] = useState(false);
  const [showEvilEffect, setShowEvilEffect] = useState(false);
  const [showTravelerEffect, setShowTravelerEffect] = useState(false);
  const [showVoteEffect, setShowVoteEffect] = useState(false);

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

  const handleHeartLeftClick = () => {
    if (heartCount > 0) {
      decreaseHeart();
      // Trigger death animation
      setShowDeathEffect(true);
      setTimeout(() => setShowDeathEffect(false), 800);
    }
  };

  const handleHeartRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    increaseHeart();
  };

  const handleVoteLeftClick = () => {
    decreaseVote();
    setShowVoteEffect(true);
    setTimeout(() => setShowVoteEffect(false), 600);
  };

  const handleVoteRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    increaseVote();
  };

  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <motion.div
        className="flex flex-col items-center w-[9vw] cursor-pointer relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTownsfolkClick}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <div className="relative">
          <img src="/images/townsfolk.png" alt="Townsfolk" className="w-[50px]" />
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
          className="leading-[55px]"
        >
          {townsfolk} / {outsider}
        </motion.span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center w-[9vw] cursor-pointer relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEvilClick}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <div className="relative">
          <img src="/images/evil.png" alt="Evil" className="w-[50px]" />
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
          className="leading-[55px]"
        >
          {minion} / {demon}
        </motion.span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center w-[9vw] cursor-pointer relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTravelerClick}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <div className="relative">
          <img src="/images/travelors.png" alt="Travelers" className="w-[50px]" />
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
          className="leading-[55px]"
        >
          {traveler}
        </motion.span>
      </motion.div>

      {featureRoles && (
        <>
          <motion.div
            className="flex flex-col items-center cursor-pointer select-none w-[9vw] relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHeartLeftClick}
            onContextMenu={handleHeartRightClick}
            title="Left click: decrease | Right click: increase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <img src="/images/heart.png" alt="Heart" className="w-[50px] pointer-events-none" />
              <AnimatePresence>
                {showDeathEffect && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1.2, rotate: -45 }}
                    exit={{ opacity: 0, scale: 1.5, rotate: -45 }}
                    transition={{ 
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <motion.div
                      className="text-red-600 font-bold text-4xl drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                      style={{
                        textShadow: '0 0 10px rgba(220, 38, 38, 1), 0 0 20px rgba(220, 38, 38, 0.8)',
                      }}
                    >
                      ✕
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.span
              key={heartCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="leading-[55px] pointer-events-none"
            >
              {heartCount}
            </motion.span>
          </motion.div>

          <motion.div
            className="flex flex-col items-center cursor-pointer select-none w-[9vw] relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoteLeftClick}
            onContextMenu={handleVoteRightClick}
            title="Left click: decrease | Right click: increase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <img src="/images/box.png" alt="Box" className="h-[50px] pointer-events-none" />
              <AnimatePresence>
                {showVoteEffect && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5, y: -10 }}
                    animate={{ opacity: 1, scale: 1.2, y: 0 }}
                    exit={{ opacity: 0, scale: 1.5, y: 10 }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <motion.div
                      className="text-green-400 font-bold text-3xl"
                      style={{
                        textShadow: '0 0 10px rgba(74, 222, 128, 1), 0 0 20px rgba(74, 222, 128, 0.8), 0 0 30px rgba(34, 197, 94, 0.6)',
                      }}
                    >
                      ✓
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.span
              key={voteCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="leading-[55px] pointer-events-none"
            >
              {voteCount}
            </motion.span>
          </motion.div>
        </>
      )}
    </div>
  );
}

