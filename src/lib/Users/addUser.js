import { supabase } from "../supabase";

function getExtension(filename) {
  return filename.substring(filename.lastIndexOf("."));
}

function createSafeFileName(originalName) {
  const ext = getExtension(originalName);
  const safeId = crypto.randomUUID();
  const timestamp = Date.now();

  return `${timestamp}-${safeId}${ext}`;
}

export async function addUser(form) {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      role,
      hotel_id,
      status,
      avatar,
      cv,
    } = form;

    // 🔹 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const userId = data.user?.id;

    if (!userId) throw new Error("User ID missing");

    // 🔹 2. Upload avatar (SAFE NAME)
    let avatar_url = null;

    if (avatar) {
      const safeName = createSafeFileName(avatar.name);
      const path = `${userId}/${safeName}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(path, avatar);

      if (uploadError) throw uploadError;

      avatar_url = uploadData.path;
    }

    // 🔹 3. Upload CV (SAFE NAME)
    let cv_url = null;

    if (cv) {
      const safeName = createSafeFileName(cv.name);
      const path = `${userId}/${safeName}`;

      const { data: cvData, error: cvError } =
        await supabase.storage
          .from("cvs")
          .upload(path, cv);

      if (cvError) throw cvError;

      cv_url = cvData.path;
    }

    // 🔹 4. Insert profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name,
        email,
        phone,
        role,
        hotel_id: hotel_id || null,
        status,
        avatar_url,
        cv_url,
      });

    if (profileError) throw profileError;

    return { success: true };

  } catch (error) {
    console.error("addUser error:", error);
    return { success: false, error };
  }
}