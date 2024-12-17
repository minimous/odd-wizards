import { create } from 'zustand';

interface SidebarStore {
  isOpened: boolean;
  setOpen: (open: boolean) => void;
}

export const useNavbarMobile = create<SidebarStore>((set) => ({
  isOpened: false,
  setOpen: (open: boolean) => set((state) => ({ isOpened: open }))
}));
