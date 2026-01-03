import { create } from "zustand";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Invalid user in localStorage, clearing it");
    localStorage.removeItem("user");
    return null;
  }
};

const useStore = create((set) => ({
  // Auth state
  user: getStoredUser(),
  isAuthenticated: !!localStorage.getItem("access_token"),

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false, cart: null });
  },

  // Cart
  cart: null,
  setCart: (cart) => set({ cart }),

  // Loading
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useStore;
