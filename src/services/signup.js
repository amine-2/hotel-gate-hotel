import { supabase } from "../lib/supabase";


export async function signupUser({ full_name, email, password, role, phone }) {
  // 1. Create auth user (ADMIN way)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    
  });

  if (error) return { error };

  const userId = data.user.id;

  // 2. Insert profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    email,
    full_name,
    role,
    phone
  });

  if (profileError) return { error: profileError };

  return { success: true };
}
// services/signup