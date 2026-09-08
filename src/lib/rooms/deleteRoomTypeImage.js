import { supabase } from "../supabase";

export async function deleteRoomTypeImage(path) {
  if (!path) {
    return {
      error: new Error("Image path is required"),
    };
  }

  const { error } = await supabase.storage
    .from("room-types-imgs")
    .remove([path]);

  if (error) {
    console.error("deleteRoomTypeImage:", error);
    return { error };
  }

  return { error: null };
}