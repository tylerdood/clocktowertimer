export interface CharacterState {
  townsfolk: number;
  outsider: number;
  minion: number;
  demon: number;
  traveler: number;
  heartCount: number;
  voteCount: number;
}

export interface CharacterActions {
  updateCounts: (playerCount: number, travelerCount: number) => void;
  setHeartCount: (count: number) => void;
  setVoteCount: (count: number) => void;
  increaseHeart: () => void;
  decreaseHeart: () => void;
  increaseVote: () => void;
  decreaseVote: () => void;
}


