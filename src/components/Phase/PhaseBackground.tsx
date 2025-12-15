import { AnimatePresence, motion } from "framer-motion";
import { usePhaseStore } from "../../store/phaseStore";

const backgroundImages = {
  DAY: "/images/village-day-new-blur.jpg",
  ENDOFDAY: "/images/village-end-of-day-new-blur.jpg",
  NIGHT: "/images/village-night-new-blur.jpg",
};

export function PhaseBackground() {
  const { currentPhase } = usePhaseStore();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url(${backgroundImages[currentPhase]})`,
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url(${backgroundImages[currentPhase]})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </div>
  );
}
