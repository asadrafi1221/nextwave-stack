import type { User } from "@supabase/supabase-js";

export interface IUserState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null, accessToken: string | null) => void;
  logout: () => Promise<void>;
}
