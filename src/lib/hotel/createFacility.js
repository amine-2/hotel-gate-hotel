import { supabase } from "../supabase";

const BUCKET = "facilities-icons";

export async function createFacility(name, iconFile) {
  if (!name?.trim()) {
    return {
      data: null,
      error: new Error("Facility name is required"),
    };
  }

  if (!iconFile) {
    return {
      data: null,
      error: new Error("Facility icon is required"),
    };
  }

  if (!iconFile.type.startsWith("image/")) {
    return {
      data: null,
      error: new Error("Only image files are allowed"),
    };
  }

  if (iconFile.size > 5 * 1024 * 1024) {
    return {
      data: null,
      error: new Error("Icon must be smaller than 5 MB"),
    };
  }

  const extension =
    iconFile.name.split(".").pop()?.toLowerCase() || "png";

  const filePath = `${crypto.randomUUID()}.${extension}`;

  // Upload icon
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, iconFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: iconFile.type,
    });

  if (uploadError) {
    console.error("Facility icon upload error:", uploadError);

    return {
      data: null,
      error: uploadError,
    };
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  const iconUrl = publicUrlData?.publicUrl;

  if (!iconUrl) {
    // Cleanup uploaded file
    await supabase.storage
      .from(BUCKET)
      .remove([filePath]);

    return {
      data: null,
      error: new Error("Could not generate facility icon URL"),
    };
  }

  // Create facility
  const { data, error } = await supabase
    .from("facilities")
    .insert({
      name: name.trim(),
      icon_url: iconUrl,
    })
    .select(`
      id,
      name,
      icon_url
    `)
    .single();

  if (error) {
    console.error("Create facility error:", error);

    // If DB insert fails, don't leave orphaned image
    await supabase.storage
      .from(BUCKET)
      .remove([filePath]);

    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
}