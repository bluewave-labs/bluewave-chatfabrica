import { create } from "zustand";

type TextAreaStore = {
  text: string;
  setText: (text: string) => void;
  clearText: () => void;
};

export const useTextArea = create<TextAreaStore>((set) => ({
  text: "",
  setText: (text) => set({ text }),
  clearText: () => set({ text: "" }),
}));
