import { create } from "zustand";

const useStore = create((set) => ({
  isLoggedIn: false,
  accountID: 0,
  sessionID: "",
  setAccountID: (val) => set({ accountID: val }),
  setSessionID: (val) => set({ sessionID: val }),
  setIsLoggedIn: (val = true) => set({ isLoggedIn: val }),
}));

export default useStore;
