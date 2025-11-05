import { IAPIResponse } from "@/store/api/types";
import { supabase } from "../supabase";

export const auth = {
  // 🔐 Sign Up
  signUp: async (
    email: string,
    password: string
  ): Promise<IAPIResponse<any>> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error)
      return {
        success: false,
        error: { message: error.message, code: error.code },
        status: 400,
      };
    return { success: true, data, status: 200 };
  },

  // 🔑 Sign In
  signIn: async (
    email: string,
    password: string
  ): Promise<IAPIResponse<any>> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      return {
        success: false,
        error: { message: error.message, code: error.code },
        status: 401,
      };
    return { success: true, data, status: 200 };
  },

  // 🚪 Sign Out
  signOut: async (): Promise<IAPIResponse<null>> => {
    const { error } = await supabase.auth.signOut();
    if (error)
      return {
        success: false,
        error: { message: error.message, code: error.code },
        status: 400,
      };
    return { success: true, status: 200 };
  },

  // 🙋‍♂️ Get Current User
  getCurrentUser: async (): Promise<IAPIResponse<any>> => {
    const { data, error } = await supabase.auth.getUser();
    if (error)
      return {
        success: false,
        error: { message: error.message, code: error.code },
        status: 400,
      };
    return { success: true, data, status: 200 };
  },

  // 💾 Get Current Session
  getCurrentSession: async (): Promise<IAPIResponse<any>> => {
    const { data, error } = await supabase.auth.getSession();
    if (error)
      return {
        success: false,
        error: { message: error.message, code: error.code },
        status: 400,
      };
    return { success: true, data, status: 200 };
  },

  // 🔄 Listen for Auth State Changes
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange((_event, session) =>
      callback(_event, session)
    ),
};
