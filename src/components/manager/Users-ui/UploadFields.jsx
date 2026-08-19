import { useRef } from "react";
import { UploadCloud, FileText, Image as ImageIcon, X } from "lucide-react";

export default function UploadFields({ form, onChange }) {
  const avatarRef = useRef();
  const cvRef = useRef();

  const handleFile = (file, type) => {
    if (!file) return;
    onChange(type, file);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file, type);
  };

  const removeFile = (type) => {
    onChange(type, null);
  };

  return (
    <div className="space-y-4 py-4">
      <h3 className="font-semibold text-lg">Uploads</h3>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-4">

        {/* 🔹 AVATAR (1 column) */}
        <div className="col-span-1">
          <p className="mb-2 text-sm text-zinc-400 dark:text-zinc-300">Image</p>

          <div
            onClick={() => avatarRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "avatar")}
            className="relative border-2 border-dashed border-zinc-600 dark:border-zinc-300 rounded-xl p-4 h-full flex items-center justify-center cursor-pointer hover:border-zinc-400 transition dark:hover:border-zinc-400"
          >
            {form.avatar ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(form.avatar)}
                  className="w-20 h-20 rounded-full object-cover"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile("avatar");
                  }}
                  className="absolute -top-2 -right-2 bg-black/70 p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-zinc-400  dark:text-zinc-300">
                <ImageIcon size={22} />
                <span className="text-xs mt-1">Upload</span>
              </div>
            )}

            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleFile(e.target.files[0], "avatar")
              }
            />
          </div>
        </div>

        {/* 🔹 CV (2 columns wider) */}
        <div className="col-span-2">
          <p className="mb-2 text-sm text-zinc-400 dark:text-zinc-300">CV</p>

          <div
            onClick={() => cvRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "cv")}
            className="relative border-2 border-dashed border-zinc-600 dark:border-zinc-300 rounded-xl p-4 h-full flex items-center justify-center cursor-pointer hover:border-zinc-400 transition dark:hover:border-zinc-400"
          >
            {form.cv ? (
              <div className="flex items-center justify-between w-full bg-zinc-800 px-3 py-2 rounded">
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <FileText size={18} />
                  {form.cv.name}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile("cv");
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-zinc-400  dark:text-zinc-300">
                <UploadCloud size={22} />
                <span className="text-sm">Drop CV or click</span>
                <span className="text-xs">PDF</span>
              </div>
            )}

            <input
              ref={cvRef}
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) =>
                handleFile(e.target.files[0], "cv")
              }
            />
          </div>
        </div>

      </div>
    </div>
  );
}