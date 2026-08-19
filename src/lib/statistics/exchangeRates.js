import { supabase } from "../supabase";

export async function getRates() {
  const { data, error } = await supabase
    .from("exchange_rates")
    .select("*")
    .order("from_currency");

  if (error) throw error;
  return data;
}

export async function updateRate(id, rate) {
  const { data, error } = await supabase
    .from("exchange_rates")
    .update({ rate })
    .eq("id", id)
    .select();

  if (error) {
    console.error("UPDATE ERROR:", error);
    throw error;
  }

  return data;
}
export async function createRate(data) {
  const { data: res, error } = await supabase
    .from("exchange_rates")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return res;
}

export async function deleteRate(id) {
  const { error } = await supabase
    .from("exchange_rates")
    .delete()
    .eq("id", id);

  if (error) throw error;
}