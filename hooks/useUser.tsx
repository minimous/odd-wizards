import { mst_users } from '@prisma/client';
import { create } from 'zustand';

interface SidebarStore {
  user: mst_users;
  setUser: (user: mst_users) => void
}

export const useUser = create<SidebarStore>((set) => ({
  user: {} as mst_users,
  setUser: (user: mst_users) => set({ user })
}));