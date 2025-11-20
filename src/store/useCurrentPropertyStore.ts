// src/store/useCurrentPropertyStore.ts
import { create } from "zustand";

type CurrentPropertyState = {
  currentPropertyId: number | null;
  currentPropertyName: string | null;
  setCurrentProperty: (id: number, name: string) => void;
  clearCurrentProperty: () => void;
};

export const useCurrentPropertyStore = create<CurrentPropertyState>((set) => ({
  currentPropertyId: null,
  currentPropertyName: null,

  setCurrentProperty: (id, name) =>
    set({
      currentPropertyId: id,
      currentPropertyName: name,
    }),

  clearCurrentProperty: () =>
    set({
      currentPropertyId: null,
      currentPropertyName: null,
    }),
}));
