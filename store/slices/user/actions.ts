import { supabase } from "@/utils/supabase/supabase";
import { IUserState } from "./types";

const partializeUser = (state: IUserState) => ({
  user: state.user,
  accessToken: state.accessToken,
});

export { partializeUser };
