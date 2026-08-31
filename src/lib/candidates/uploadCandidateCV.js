import { supabase } from "../supabase";

export async function uploadCandidateCV(
  applicationId,
  file
) {
  if (!applicationId || !file) {
    throw new Error(
      "Application ID and file are required"
    );
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "pdf";

  const filePath = `${applicationId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("candidate-cvs")
    .upload(filePath, file, {
      upsert: false,
    });

  if (uploadError) {
    console.error(
      "uploadCandidateCV:",
      uploadError
    );

    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("candidate-cvs")
    .getPublicUrl(filePath);

  return publicUrl;
}