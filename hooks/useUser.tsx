import { mst_staker, mst_users } from '@prisma/client';
import { create } from 'zustand';

interface SidebarStore {
  user: mst_users;
  staker: mst_staker;
  setUser: (user: mst_users) => void;
  setStaker: (staker: mst_staker) => void;
}

export const useUser = create<SidebarStore>((set) => ({
  user: {} as mst_users,
  staker: {} as mst_staker,
  setUser: (user: mst_users) => set({ user }),
  setStaker: (staker: mst_staker) => set({ staker })
}));