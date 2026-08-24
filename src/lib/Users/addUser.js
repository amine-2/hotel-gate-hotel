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
      status,
      avatar,
      cv,
    } = form;

    // ==========================================
    // 1. Create Auth user + profile
    // ==========================================

    const { data, error } = await supabase.functions.invoke(
      "create-staff",
      {
        body: {
          email,
          password,
          full_name,
          phone,
          role,
          status,
        },
      }
    );

    if (error) throw error;

    if (!data?.success || !data?.userId) {
      throw new Error(
        data?.error || "Failed to create user"
      );
    }

    const userId = data.userId;

    // ==========================================
    // 2. Upload avatar
    // ==========================================

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

    // ==========================================
    // 3. Upload CV
    // ==========================================

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

    // ==========================================
    // 4. Update profile with file paths
    // ==========================================

    if (avatar_url || cv_url) {
      const updateData = {};

      if (avatar_url) {
        updateData.avatar_url = avatar_url;
      }

      if (cv_url) {
        updateData.cv_url = cv_url;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (updateError) throw updateError;
    }

    return {
      success: true,
      userId,
    };

  } catch (error) {
    console.error("addUser error:", error);

    return {
      success: false,
      error,
    };
  }
}