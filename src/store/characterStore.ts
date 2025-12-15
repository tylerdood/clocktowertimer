import { create } from 'zustand';
import type { CharacterState, CharacterActions } from '../types/character.types';
import { CHARACTER_AMOUNTS } from '../utils/constants';

interface CharacterStore extends CharacterState, CharacterActions {}

export const useCharacterStore = create<CharacterStore>((set) => ({
  townsfolk: 0,
  outsider: 0,
  minion: 0,
  demon: 0,
  traveler: 0,
  heartCount: 0,
  voteCount: 0,

  updateCounts: (playerCount: number, travelerCount: number) => {
    const amounts = CHARACTER_AMOUNTS[playerCount] || [0, 0, 0, 0];
    set({
      townsfolk: amounts[0],
      outsider: amounts[1],
      minion: amounts[2],
      demon: amounts[3],
      traveler: travelerCount,
      heartCount: playerCount + travelerCount,
      voteCount: playerCount + travelerCount,
    });
  },

  setHeartCount: (count: number) => {
    set({ heartCount: Math.max(0, Math.min(count, 20)) });
  },

  setVoteCount: (count: number) => {
    set({ voteCount: Math.max(0, Math.min(count, 20)) });
  },

  increaseHeart: () => {
    set((state) => ({ heartCount: Math.min(state.heartCount + 1, 20) }));
  },

  decreaseHeart: () => {
    set((state) => ({ heartCount: Math.max(state.heartCount - 1, 0) }));
  },

  increaseVote: () => {
    set((state) => ({ voteCount: Math.min(state.voteCount + 1, 20) }));
  },

  decreaseVote: () => {
    set((state) => ({ voteCount: Math.max(state.voteCount - 1, 0) }));
  },
}));

