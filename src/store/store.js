import { create } from "zustand";

const useStore = create((set) => ({
  favorites: [],
  isLoggedIn:false,

  setIsLoggedIn : (val = true)=>set({isLoggedIn:val}), 

  addFavorite: (movie) =>
    set((state) => ({
      favorites: [...state.favorites, movie],
    })),

  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter(
        (movie) => movie.id !== id
      ),
    })),
}));

export default useStore;