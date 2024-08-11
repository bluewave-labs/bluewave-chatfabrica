import { create } from "zustand";

type CharactersStore = {
  totalCharacters: {
    file: number;
    link: number;
    text: number;
  };
  addCharacters: (
    newCharacters: number,
    type: "file" | "link" | "text"
  ) => void;
  deleteCharacters: (
    characters: number,
    type: "file" | "link" | "text"
  ) => void;
  clearCharacters: (type: "file" | "link" | "text") => void;
};

export const useCharactersStore = create<CharactersStore>((set) => ({
  totalCharacters: {
    file: 0,
    link: 0,
    text: 0,
  },
  addCharacters: (newCharacters, type) => {
    set((state) => ({
      totalCharacters: {
        ...state.totalCharacters,
        [type]: state.totalCharacters[type] + newCharacters,
      },
    }));
  },
  deleteCharacters: (characters, type) => {
    set((state) => ({
      totalCharacters: {
        ...state.totalCharacters,
        [type]: state.totalCharacters[type] - characters,
      },
    }));
  },
  clearCharacters: (type) => {
    set((state) => ({
      totalCharacters: {
        ...state.totalCharacters,
        [type]: 0,
      },
    }));
  },
}));
