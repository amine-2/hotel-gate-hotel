import { useEffect, useState } from "react";
import { timeAgo } from "../services/timeAgo";
import { getIssueById } from "../lib/issues/getIssueById";

const urgencyStyles = {
  low: "bg-green-100 text-green-600",
  medium: "bg-yellow-100 text-yellow-600",
  high: "bg-red-100 text-red-600",
  critical: "bg-purple-100 text-purple-600",
};

export default function IssueCard({ issueId, onSelect }) {
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    load();
  }, [issueId]);

  const load = async () => {
    const data = await getIssueById(issueId);
    setIssue(data);
  };

  if (!issue) {
    return (
      <div className="p-4 border rounded-lg animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(issue)}
      className="p-4 border border-zinc-500 rounded-lg cursor-pointer hover:bg-zinc-50 transition  dark:hover:bg-zinc-800 "
    >
      {/* HEADER */}
      <div className=" flex justify-between mb-4 items-center gap-3">

        <h3 className=" font-medium">
          {issue.title}
        </h3>

        

        <span
          className={`text-xs px-2 py-1 rounded ${
            urgencyStyles[issue.urgency] || urgencyStyles.low
          }`}
        >
          {issue.urgency}
        </span>
      </div>

      <h3 className=" w-full text-left  text-zinc-700  dark:text-zinc-300 ">
          {issue.hotel?.name?.en || "Global"}
        </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-zinc-500 truncate mb-4">
        {issue.description}
      </p>

      {/* FOOTER */}
      <div className="text-xs text-zinc-400 mt-1">
        {issue.status} • {issue.category} • Created by{" "}
        {issue.creator?.full_name || "—"} •{" "}
        Created {timeAgo(issue.created_at)}
      </div>
    </div>
  );
}