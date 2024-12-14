import { mst_users } from '@prisma/client';
import { create } from 'zustand';

interface SidebarStore {
  claim: boolean;
  setClaim: (claim: boolean) => void
}

export const useClaim = create<SidebarStore>((set) => ({
    claim: false,
    setClaim: (claim: boolean) => set({ claim })
}));