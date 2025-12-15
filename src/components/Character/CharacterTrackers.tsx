import { motion } from 'framer-motion';
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

  const handleHeartLeftClick = () => {
    decreaseHeart();
  };

  const handleHeartRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    increaseHeart();
  };

  const handleVoteLeftClick = () => {
    decreaseVote();
  };

  const handleVoteRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    increaseVote();
  };

  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <motion.div
        className="flex flex-col items-center w-[9vw]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <img src="/images/townsfolk.png" alt="Townsfolk" className="w-[50px]" />
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
        className="flex flex-col items-center w-[9vw]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <img src="/images/evil.png" alt="Evil" className="w-[50px]" />
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
        className="flex flex-col items-center w-[9vw]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <img src="/images/travelors.png" alt="Travelers" className="w-[50px]" />
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
            className="flex flex-col items-center cursor-pointer select-none w-[9vw]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHeartLeftClick}
            onContextMenu={handleHeartRightClick}
            title="Left click: decrease | Right click: increase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <img src="/images/heart.png" alt="Heart" className="w-[50px] pointer-events-none" />
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
            className="flex flex-col items-center cursor-pointer select-none w-[9vw]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoteLeftClick}
            onContextMenu={handleVoteRightClick}
            title="Left click: decrease | Right click: increase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <img src="/images/box.png" alt="Box" className="h-[50px] pointer-events-none" />
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

