import type { KeybindingMap } from '../types/settings.types';

/**
 * Finds the action associated with a key press
 */
export function findKey(search: string, map: KeybindingMap): string | null {
  const normalizedSearch = search.length === 1 ? search.toUpperCase() : search;
  
  for (const key in map) {
    const binding = map[key as keyof KeybindingMap];
    if (typeof binding === 'string' && binding === normalizedSearch) {
      return key;
    }
    if (Array.isArray(binding) && binding.includes(normalizedSearch)) {
      return key;
    }
  }
  return null;
}

/**
 * Fills alternative key names (e.g., "Spacebar" <-> " ")
 */
export function fillAlternativeKeys(keys: KeybindingMap): void {
  for (const k in keys) {
    const key = k as keyof KeybindingMap;
    let binding = keys[key];
    
    // Normalize to array
    if (typeof binding === 'string') {
      binding = [binding];
    }
    
    // Add alternatives
    if (binding.includes('Spacebar') && !binding.includes(' ')) {
      binding.push(' ');
    } else if (binding.includes(' ') && !binding.includes('Spacebar')) {
      binding.push('Spacebar');
    }
    
    if (binding.includes('Up') && !binding.includes('ArrowUp')) {
      binding.push('ArrowUp');
    } else if (binding.includes('ArrowUp') && !binding.includes('Up')) {
      binding.push('Up');
    }
    
    if (binding.includes('Down') && !binding.includes('ArrowDown')) {
      binding.push('ArrowDown');
    } else if (binding.includes('ArrowDown') && !binding.includes('Down')) {
      binding.push('Down');
    }
    
    if (binding.includes('Left') && !binding.includes('ArrowLeft')) {
      binding.push('ArrowLeft');
    } else if (binding.includes('ArrowLeft') && !binding.includes('Left')) {
      binding.push('Left');
    }
    
    if (binding.includes('Right') && !binding.includes('ArrowRight')) {
      binding.push('ArrowRight');
    } else if (binding.includes('ArrowRight') && !binding.includes('Right')) {
      binding.push('Right');
    }
    
    keys[key] = binding;
  }
}

