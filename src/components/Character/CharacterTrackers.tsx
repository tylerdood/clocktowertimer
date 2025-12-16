import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useSound } from '../../hooks/useSound';

export function CharacterTrackers() {
  const {
    heartCount,
    voteCount,
    increaseHeart,
    decreaseHeart,
    increaseVote,
    decreaseVote,
  } = useCharacterStore();
  const { featureRoles } = useSettingsStore();
  const { playKnifeSharpener, playShortWind, playTissueOutOfBox, playPageTurning } = useSound();
  const [showDeathEffect, setShowDeathEffect] = useState(false);
  const [showVoteEffect, setShowVoteEffect] = useState(false);

  const handleHeartLeftClick = () => {
    if (heartCount > 0) {
      decreaseHeart();
      playKnifeSharpener();
      // Trigger death animation
      setShowDeathEffect(true);
      setTimeout(() => setShowDeathEffect(false), 800);
    }
  };

  const handleHeartRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    increaseHeart();
    playShortWind();
  };

  const handleVoteLeftClick = () => {
    decreaseVote();
    playTissueOutOfBox();
    setShowVoteEffect(true);
    setTimeout(() => setShowVoteEffect(false), 600);
  };

  const handleVoteRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    increaseVote();
    playPageTurning();
  };

  return (
    <div className="flex flex-row justify-center items-center gap-4">
      {featureRoles && (
        <>
          <motion.div
            className="flex flex-col items-center cursor-pointer select-none w-[9vw] relative"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHeartLeftClick}
            onContextMenu={handleHeartRightClick}
            title="Left click: decrease | Right click: increase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 rounded-full border-2 border-clocktower-gold/50 shadow-[0_0_6px_rgba(212,175,55,0.3)] pointer-events-none transition-all duration-200 group-hover:border-clocktower-gold/80 group-hover:shadow-[0_0_12px_rgba(212,175,55,0.6)]" style={{ width: '65px', height: '65px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
              <img src="/images/heart.png" alt="Heart" className="w-[50px] pointer-events-none relative z-10" />
              <div className="absolute -top-1 -right-1 bg-clocktower-gold/80 rounded-full w-4 h-4 flex items-center justify-center pointer-events-none z-20 shadow-[0_0_4px_rgba(212,175,55,0.6)]">
                <span className="text-[8px] text-black font-bold">±</span>
              </div>
              <AnimatePresence>
                {showDeathEffect && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
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
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoteLeftClick}
            onContextMenu={handleVoteRightClick}
            title="Left click: decrease | Right click: increase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 rounded-full border-2 border-clocktower-gold/50 shadow-[0_0_6px_rgba(212,175,55,0.3)] pointer-events-none transition-all duration-200 group-hover:border-clocktower-gold/80 group-hover:shadow-[0_0_12px_rgba(212,175,55,0.6)]" style={{ width: '65px', height: '65px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
              <img src="/images/box.png" alt="Box" className="h-[50px] pointer-events-none relative z-10" />
              <div className="absolute -top-1 -right-1 bg-clocktower-gold/80 rounded-full w-4 h-4 flex items-center justify-center pointer-events-none z-20 shadow-[0_0_4px_rgba(212,175,55,0.6)]">
                <span className="text-[8px] text-black font-bold">±</span>
              </div>
              <AnimatePresence>
                {showVoteEffect && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
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

