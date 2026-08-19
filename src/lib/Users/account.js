import { supabase } from "../supabase";

export async function getAccountInfo() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // get profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return {
    full_name: profile.full_name || "",
    email: user.email
  };
}

export async function updateAccountInfo(data) {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name
    })
    .eq("id", user.id);

  if (error) throw error;
}