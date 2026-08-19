import IssueCard from "./IssueCard";

export default function IssuesList({ issues, onSelect }) {
  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issueId={issue.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}