import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import type { KeybindingMap } from '../../types/settings.types';

interface KeybindingsEditorProps {
  onKeybindingsChange: (keybindings: KeybindingMap) => void;
}

export function KeybindingsEditor({ onKeybindingsChange }: KeybindingsEditorProps) {
  const { keybindings } = useSettingsStore();
  const [localKeybindings, setLocalKeybindings] = useState<KeybindingMap>({ ...keybindings });
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    setLocalKeybindings({ ...keybindings });
  }, [keybindings]);

  useEffect(() => {
    onKeybindingsChange(localKeybindings);
  }, [localKeybindings, onKeybindingsChange]);

  const handleKeyClick = (action: string, index?: number) => {
    setActiveKey(index !== undefined ? `${action}_${index}` : action);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!activeKey) return;

    let key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (key === ' ') key = 'Spacebar';
    if (key === 'Escape') {
      setActiveKey(null);
      return;
    }

    setLocalKeybindings((prev) => {
      const [action, idxStr] = activeKey.includes('_') ? activeKey.split('_') : [activeKey, null];
      const index = idxStr ? parseInt(idxStr) : undefined;
      const currentBinding = prev[action as keyof KeybindingMap];

      if (index !== undefined && Array.isArray(currentBinding)) {
        // Update specific index in array
        const newArray = [...currentBinding];
        newArray[index] = key;
        return {
          ...prev,
          [action]: newArray,
        };
      } else if (Array.isArray(currentBinding)) {
        // Replace first element
        return {
          ...prev,
          [action]: [key, ...currentBinding.slice(1)],
        };
      } else {
        // Replace string binding
        return {
          ...prev,
          [action]: key,
        };
      }
    });

    setActiveKey(null);
    e.preventDefault();
  };

  useEffect(() => {
    if (activeKey) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [activeKey]);

  const getKeyDisplay = (binding: string | string[], index?: number): string => {
    if (Array.isArray(binding)) {
      return binding[index || 0] || '';
    }
    return binding;
  };

  const renderKeyButton = (action: string, label: string, index?: number) => {
    const binding = localKeybindings[action as keyof KeybindingMap];
    const displayKey = getKeyDisplay(binding, index);
    const isActive = activeKey === (index !== undefined ? `${action}_${index}` : action);
    const showLabel = index === undefined || index === 0;

    return (
      <div key={`${action}_${index || 0}`} className="contents">
        {showLabel ? (
          <label className="text-right pr-2 text-xs">{label}</label>
        ) : (
          <div></div>
        )}
        <button
          type="button"
          onClick={() => handleKeyClick(action, index)}
          className={`bg-black text-white px-2 py-1 rounded text-xs min-w-[60px] ${
            isActive ? 'bg-clocktower-red' : 'hover:bg-gray-800'
          }`}
        >
          {displayKey}
        </button>
      </div>
    );
  };

  return (
    <fieldset className="border border-white/20 p-3 rounded">
      <legend className="font-almendra text-sm px-2">Keybindings</legend>
      <div className="grid grid-cols-2 gap-2 mt-2 text-sm items-center">
        {renderKeyButton('startstop', 'Start/Stop Timer')}
        {renderKeyButton('recall', 'Recall Town')}
        {renderKeyButton('nextphase', 'Next Phase', 0)}
        {renderKeyButton('nextphase', '', 1)}
        {renderKeyButton('previousphase', 'Previous Phase')}
        {renderKeyButton('aliveplus', 'Resurrect')}
        {renderKeyButton('aliveminus', 'Death')}
        {renderKeyButton('voteplus', 'Regain Vote')}
        {renderKeyButton('voteminus', 'Ghostvote')}
        {renderKeyButton('timerreset', 'Reset Timer')}
        {renderKeyButton('timer', 'Edit Timer')}
        {renderKeyButton('timeplus', 'Increase Timer', 0)}
        {renderKeyButton('timeplus', '', 1)}
        {renderKeyButton('timeplus', '', 2)}
        {renderKeyButton('timeminus', 'Decrease Timer', 0)}
        {renderKeyButton('timeminus', '', 1)}
        {renderKeyButton('timeminus', '', 2)}
        {renderKeyButton('mute', 'Toggle Mute')}
        {renderKeyButton('fullscreen', 'Toggle Fullscreen')}
        {renderKeyButton('toggleinfo', 'Toggle Info')}
        {renderKeyButton('togglesettings', 'Open Settings')}
      </div>
    </fieldset>
  );
}
