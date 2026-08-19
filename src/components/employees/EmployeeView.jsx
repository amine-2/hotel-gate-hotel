import { useEffect, useState } from "react";
import { Copy, Check, PenLine } from "lucide-react";

import { getEmployee } from "../../lib/Users/getEmployee";
import { updateEmployee } from "../../lib/users/updateEmployee";
import { uploadEmployeeFile } from "../../lib/Users/uploadEmployeeFile";

import ExpandButton from "../ExpandButton";
import EmployeeActions from "./EmployeeActions";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeDetails from "./EmployeeDetails";
import EmployeeFiles from "./EmployeeFiles";

export default function EmployeeView({ userId }) {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [files, setFiles] = useState({
    avatar: null,
    cv: null,
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getEmployee(userId);
    setData(res);
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    let updates = { ...data };

    if (files.avatar) {
      const path = await uploadEmployeeFile(
        data.id,
        files.avatar,
        "avatar"
      );
      updates.avatar_url = path;
    }

    if (files.cv) {
      const path = await uploadEmployeeFile(
        data.id,
        files.cv,
        "cv"
      );
      updates.cv_url = path;
    }

    await updateEmployee(data.id, updates);

    setData(updates);
    setFiles({ avatar: null, cv: null });
    setEditing(false);
  };

  // 🧠 Copy handler
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (!data)
    return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <div className="flex items-center gap-3">

          <h2 className="text-xl font-semibold">
            Employee Details
          </h2>

          {/* ID badge */}
          <div className="flex items-center gap-2  text-zinc-600  px-2 py-1 rounded dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700">

            <span title={data.id} className="cursor-default ">
              ID: {data.id?.slice(0, 6)}...
            </span>

            {/* COPY BUTTON */}
            <button
              onClick={() => handleCopy(data.id)}
              title={copied ? "Copied!" : "Copy ID"}
              className="relative group hover:text-zinc-900 transition cursor-pointer dark:hover:text-white dark:text-zinc-300"
            >
              {copied ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} />
              )}

              
            </button>

          </div>
        </div>

        {/* EDIT BUTTON */}
        {!editing && (
          <ExpandButton
            onClick={() => setEditing(true)}
            icon={
              <PenLine
                size={16}
                className="text-white"
              />
            }
            label="Edit"
            className="px-2 py-1 bg-zinc-900 rounded text-white hover:bg-zinc-700"
          />
        )}
      </div>

      {/* FILES */}
      <EmployeeFiles
        data={data}
        files={files}
        setFiles={setFiles}
        editing={editing}
      />

      {/* HEADER INFO */}
      <EmployeeHeader
        data={data}
        editing={editing}
        onChange={handleChange}
      />

      {/* DETAILS */}
      <EmployeeDetails
        data={data}
        editing={editing}
        onChange={handleChange}
      />

      {/* ACTIONS */}
      <div className="flex gap-3 justify-end">
        {editing && (
          <>
            <button
              onClick={() => setEditing(false)}
              className="bg-zinc-300 px-4 py-2 rounded hover:bg-zinc-400 transition cursor-pointer dark:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500 transition cursor-pointer dark:bg-green-600 dark:hover:bg-green-500"
            >
              Save
            </button>
          </>
        )}
      </div>

      {/* EXTRA ACTIONS */}
      <EmployeeActions
        data={data}
        onRefresh={load}
      />
    </div>
  );
}