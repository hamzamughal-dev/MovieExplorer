import { create } from "zustand";

const useStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("session_id"),
  accountID: 0,
  setAccountID: (val) => set({ accountID: val }),

  setIsLoggedIn: (val = true) => set({ isLoggedIn: val }),
}));

export default useStore;
