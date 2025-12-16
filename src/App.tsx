import { useEffect, useState } from 'react';
import { PhaseBackground } from './components/Phase/PhaseBackground';
import { PhaseIndicator } from './components/Phase/PhaseIndicator';
import { PhaseAdvanceButton } from './components/Phase/PhaseAdvanceButton';
import { TimerDisplay } from './components/Timer/TimerDisplay';
import { CharacterTrackers } from './components/Character/CharacterTrackers';
import { CharacterDisplays } from './components/Character/CharacterDisplays';
import { ControlPanel } from './components/Controls/ControlPanel';
import { SettingsButton } from './components/Controls/SettingsButton';
import { SettingsModal } from './components/Settings/SettingsModal';
import { useSettingsStore } from './store/settingsStore';
import { useCharacterStore } from './store/characterStore';
import { useKeybindings } from './hooks/useKeybindings';

function App() {
  const [showSettings, setShowSettings] = useState(true); // Open settings on first load
  const { loadSettings, playerCount, travelerCount } = useSettingsStore();
  const { updateCounts } = useCharacterStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize settings on mount
  useEffect(() => {
    if (!isInitialized) {
      loadSettings();
      setIsInitialized(true);
    }
  }, [isInitialized, loadSettings]);

  // Update character counts when settings change
  useEffect(() => {
    if (isInitialized && playerCount > 0) {
      updateCounts(playerCount, travelerCount);
    }
  }, [isInitialized, playerCount, travelerCount, updateCounts]);


  // Initialize keybindings
  useKeybindings();

  return (
    <div className="h-screen w-screen overflow-hidden text-center text-clocktower-text font-almendra text-4vw relative">
      <PhaseBackground />
      
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        <SettingsButton onOpenSettings={() => setShowSettings(true)} />
        <CharacterDisplays />
        <PhaseIndicator />
        <div className="flex justify-center my-2">
          <PhaseAdvanceButton />
        </div>
        <TimerDisplay />
        <ControlPanel />
        <CharacterTrackers />
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;

