import { useRef } from "react";
import { UploadCloud, FileText, Image as ImageIcon, X } from "lucide-react";

export default function FileDropZone({
  type,
  file,
  existingUrl,
  onChange,
}) {
  const inputRef = useRef();
  const isAvatar = type === "avatar";

  const handleFile = (file) => {
    if (!file) return;
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative border-2 border-dashed border-zinc-600 rounded-xl p-4 
      flex items-center justify-center cursor-pointer hover:border-zinc-400 transition h-full dark:border-zinc-300 dark:hover:border-zinc-400" 
    >

      {/* PREVIEW */}
      {file || existingUrl ? (
        isAvatar ? (
          <div className="relative">
            <img
              src={file ? URL.createObjectURL(file) : existingUrl}
              className="w-20 h-20 rounded-full object-cover"
            />

            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-black/70 p-1 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full bg-zinc-800 px-3 py-2 rounded">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <FileText size={18} />
              {file ? file.name : "Current CV"}
            </div>

            <button
              onClick={removeFile}
              className="text-zinc-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center text-zinc-400">
          {isAvatar ? <ImageIcon size={22} /> : <UploadCloud size={22} />}
          <span className="text-xs mt-1">
            {isAvatar ? "Upload Image" : "Drop CV or click"}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={isAvatar ? "image/*" : ".pdf"}
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}