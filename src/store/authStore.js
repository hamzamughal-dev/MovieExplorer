import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      accountID: 0,
      sessionID: "",
      setAccountID: (val) => set({ accountID: val }),
      setSessionID: (val) => set({ sessionID: val }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useStore;
