import { create } from "zustand";

type DocsStore = {
  docs: {
    id: string;
    name: string;
    body: string;
    url: string;
    characterCount: number;
  }[];
  addDocs: (
    newDocs: {
      id: string;
      name: string;
      body: string;
      url: string;
      characterCount: number;
    }[]
  ) => void;
  removeDoc: (linkId: string) => void;
  clearDocs: () => void;
};

export const useDocsStore = create<DocsStore>((set) => ({
  docs: [],
  addDocs: (newLinks) =>
    set((state) => ({
      docs: state.docs
        .filter((f) => !newLinks.some((n) => n.id === f.id))
        .concat(newLinks),
    })),
  removeDoc: (fileId) =>
    set((state) => ({
      docs: state.docs.filter((f) => f.id !== fileId),
    })),
  clearDocs: () => set({ docs: [] }),
}));
