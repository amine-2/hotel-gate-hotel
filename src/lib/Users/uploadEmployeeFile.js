import { supabase } from "../supabase";

function getExtension(name) {
  return name.substring(name.lastIndexOf("."));
}

export async function uploadEmployeeFile(userId, file, type) {
  const ext = getExtension(file.name);
  const safeName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

  const path = `${userId}/${safeName}`;

  const bucket = type === "avatar" ? "avatars" : "cvs";

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  return data.path;
}