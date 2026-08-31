import { supabase } from "../supabase";

export async function deleteApplication({
  applicationId,
  hotelId,
}) {
  if (!applicationId || !hotelId) {
    return {
      error: new Error(
        "Application ID and Hotel ID are required"
      ),
    };
  }

  // Get the application first so we can remove its CV
  const { data: application, error: fetchError } =
    await supabase
      .from("job_applications")
      .select("cv_url")
      .eq("id", applicationId)
      .eq("hotel_id", hotelId)
      .single();

  if (fetchError) {
    console.error("deleteApplication fetch:", fetchError);

    return {
      error: fetchError,
    };
  }

  // Delete database record
  const { error: deleteError } = await supabase
    .from("job_applications")
    .delete()
    .eq("id", applicationId)
    .eq("hotel_id", hotelId);

  if (deleteError) {
    console.error(
      "deleteApplication:",
      deleteError
    );

    return {
      error: deleteError,
    };
  }

  // Delete CV from Storage
  if (application?.cv_url) {
    try {
      const marker = "/candidate-cvs/";

      const index =
        application.cv_url.indexOf(marker);

      if (index !== -1) {
        const filePath =
          application.cv_url.substring(
            index + marker.length
          );

        const { error: storageError } =
          await supabase.storage
            .from("candidate-cvs")
            .remove([filePath]);

        if (storageError) {
          console.error(
            "CV deletion failed:",
            storageError
          );
        }
      }
    } catch (err) {
      console.error(
        "Failed to remove candidate CV:",
        err
      );
    }
  }

  return {
    error: null,
  };
}