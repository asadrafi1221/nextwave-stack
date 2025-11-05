import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/utils/supabase/supabase";
import { IUserState } from "./types";
import { partializeUser } from "./actions";


export const useUserStore = create<IUserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      setUser: (user, accessToken) => set({ user, accessToken }),

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => partializeUser(state),
    }
  )
);
