import { supabase } from "../../../../lib/supabase";
import FileDropZone from "./FileDropZone";
import avatarPlaceholder from "../../../../assets/avatar-placeholder.png";

export default function EmployeeFiles({
  data,
  files,
  setFiles,
  editing,
}) {
  
  const avatarPreview = files.avatar
    ? URL.createObjectURL(files.avatar)
    : data.avatar_url
      ? supabase.storage.from("avatars").getPublicUrl(data.avatar_url).data.publicUrl
      : avatarPlaceholder;

  const cvPreview = files.cv
    ? URL.createObjectURL(files.cv)
    : data.cv_url
      ? supabase.storage.from("cvs").getPublicUrl(data.cv_url).data.publicUrl
      : null;

  const handleUpload = (file, type) => {
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  // 🔹 VIEW MODE
  if (!editing) {
    return (
      <div className=" p-4 rounded-xl flex items-center justify-between border border-zinc-600  space-y-4 ">

        <div className="flex items-center gap-4">
          <img
            src={avatarPreview}
            className="w-28 h-32 rounded-lg object-cover"
          />
        </div>

        {cvPreview && (
          <a href={cvPreview} target="_blank" className="border px-4 py-2 rounded flex 
          items-center gap-2 font-semibold hover:bg-zinc-900 hover:text-white transition cursor-pointer dark:border-zinc-300 dark:hover:bg-zinc-300 dark:hover:text-zinc-900 dark:text-zinc-300">
            View CV
          </a>
        )}
      </div>
    );
  }

  // 🔹 EDIT MODE
  return (
    <div className=" p-4 rounded-xl border border-zinc-600  space-y-4 pb-10">

      <h3 className="font-semibold">Files</h3>

      <div className="grid grid-cols-3 gap-4">

        {/* AVATAR */}
        <div className="col-span-1">
          <p className="mb-2 text-sm text-zinc-400">Image</p>

          <FileDropZone
            type="avatar"
            file={files.avatar}
            existingUrl={avatarPreview}
            onChange={(file) => handleUpload(file, "avatar")}
          />
        </div>

        {/* CV */}
        <div className="col-span-2">
          <p className="mb-2 text-sm text-zinc-400">CV</p>

          <FileDropZone
            type="cv"
            file={files.cv}
            existingUrl={cvPreview}
            onChange={(file) => handleUpload(file, "cv")}
          />
        </div>

      </div>
    </div>
  );
}