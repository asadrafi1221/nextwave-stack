// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/utils/supabase/supabase";
// import type { Session, User } from "@supabase/supabase-js";
// import { IAPIResponse } from "@/store/api/types";

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getInitialSession = async () => {
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();

//         setSession(session);
//         setUser(session?.user ?? null);
//       } catch (error) {
//         console.error("Error getting initial session:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getInitialSession();

//     // 👀 Subscribe to auth state changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   // 🧠 Auth helpers
//   const signUpWithEmail = async (
//     email: string,
//     password: string
//   ): Promise<IAPIResponse<User>> => {
//     const { data, error } = await supabase.auth.signUp({ email, password });
//     if (error)
//       return { success: false, error: { message: error.message }, status: 400 };
//     return { success: true, data: data.user as User, status: 200 };
//   };

//   const signInWithEmail = async (
//     email: string,
//     password: string
//   ): Promise<IAPIResponse<Session>> => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     if (error)
//       return { success: false, error: { message: error.message }, status: 400 };
//     return { success: true, data: data.session as Session, status: 200 };
//   };

//   const signOut = async (): Promise<IAPIResponse<null>> => {
//     const { error } = await supabase.auth.signOut();
//     if (error)
//       return { success: false, error: { message: error.message }, status: 400 };
//     return { success: true, data: null, status: 200 };
//   };

//   return {
//     user,
//     session,
//     loading,
//     isAuthenticated: !!user,
//     signUpWithEmail,
//     signInWithEmail,
//     signOut,
//   };
// };
