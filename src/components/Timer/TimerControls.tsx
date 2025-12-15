import { useState } from "react";
import { motion } from "framer-motion";
import { useTimer } from "../../hooks/useTimer";
import { usePhaseStore } from "../../store/phaseStore";
import { useSound } from "../../hooks/useSound";
import { Button } from "../UI/Button";
import { parseTime } from "../../utils/timeUtils";

export function TimerControls() {
  const {
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    incrementTimer,
    decrementTimer,
    setTime,
  } = useTimer();
  const { currentPhase } = usePhaseStore();
  const { playEndTimer } = useSound();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editValue, setEditValue] = useState("");

  const isNight = currentPhase === "NIGHT";
  const isDisabled = isRunning || isNight;

  const handleStartStop = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const handleRecall = () => {
    if (isNight) return;
    if (isRunning) {
      stopTimer();
    }
    playEndTimer();
    setTime(0);
  };

  const handleEdit = () => {
    if (isDisabled) return;
    setShowEditDialog(true);
  };

  const handleEditConfirm = () => {
    const parsedTime = parseTime(editValue);
    if (parsedTime > 0 && parsedTime <= 3599) {
      setTime(parsedTime);
      setEditValue("");
      setShowEditDialog(false);
    } else {
      alert(
        `Invalid input '${editValue}'\nPossible formats: 7.5, 7:30, 450s\nPossible range: 1 second - 59:59`
      );
    }
  };

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <Button
          onClick={handleStartStop}
          disabled={isNight}
          title="Start / Stop"
          variant="gold"
        >
          <i className={`fas ${isRunning ? "fa-stop" : "fa-play"}`}></i>
        </Button>

        <Button
          onClick={resetTimer}
          disabled={isRunning || isNight}
          title="Reset timer"
          variant="gold"
          className="restricted"
        >
          <i className="fas fa-sync-alt"></i>
        </Button>

        <Button
          onClick={handleEdit}
          disabled={isDisabled}
          title="Edit timer"
          variant="gold"
          className="restricted"
        >
          <i className="fas fa-keyboard"></i>
        </Button>

        <Button
          onClick={incrementTimer}
          disabled={isDisabled}
          title="Increment timer"
          variant="gold"
          className="restricted"
        >
          <i className="fas fa-arrow-up"></i>
        </Button>

        <Button
          onClick={decrementTimer}
          disabled={isDisabled}
          title="Decrement timer"
          variant="gold"
          className="restricted"
        >
          <i className="fas fa-arrow-down"></i>
        </Button>

        <Button
          onClick={handleRecall}
          disabled={isNight}
          title="Recall townsfolk"
          variant="gold"
        >
          <i className="fas fa-bell"></i>
        </Button>
      </div>

      {showEditDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowEditDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-clocktower-dark p-6 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="block mb-4 text-clocktower-text">
              Timer Value
            </label>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded mb-4 w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEditConfirm();
                } else if (e.key === "Escape") {
                  setShowEditDialog(false);
                }
              }}
            />
            <div className="flex gap-2">
              <Button onClick={handleEditConfirm} variant="gold">
                Set Timer
              </Button>
              <Button
                onClick={() => setShowEditDialog(false)}
                variant="default"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
