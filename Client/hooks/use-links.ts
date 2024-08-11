import { create } from "zustand";

type LinkIdsStore = {
  links: {
    id: string;
    name: string;
    body?: string;
    url?: string;
    characterCount?: number;
  }[];
  addLinks: (
    newLinks: {
      id: string;
      name: string;
      body?: string;
      url?: string;
      characterCount?: number;
    }[]
  ) => void;
  removeLink: (linkId: string) => void;
  clearLinks: () => void;
};

export const useLinksStore = create<LinkIdsStore>((set) => ({
  links: [],
  addLinks: (newLinks) =>
    set((state) => ({
      links: state.links
        .filter((f) => !newLinks.some((n) => n.id === f.id))
        .concat(newLinks),
    })),
  removeLink: (fileId) =>
    set((state) => ({
      links: state.links.filter((f) => f.id !== fileId),
    })),
  clearLinks: () => set({ links: [] }),
}));
