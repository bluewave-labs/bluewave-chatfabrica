import { create } from "zustand";

type FilesStore = {
  files: {
    id: string;
    name: string;
    characterCount?: number;
  }[];
  addFiles: (
    newFileIds: {
      id: string;
      name: string;
      characterCount?: number;
    }[]
  ) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
};

export const useFilesStore = create<FilesStore>((set) => ({
  files: [],
  addFiles: (newFiles) =>
    set((state) => ({
      files: state.files
        .filter((f) => !newFiles.some((n) => n.id === f.id))
        .concat(newFiles),
    })),
  removeFile: (fileId) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== fileId),
    })),
  clearFiles: () => set({ files: [] }),
}));
