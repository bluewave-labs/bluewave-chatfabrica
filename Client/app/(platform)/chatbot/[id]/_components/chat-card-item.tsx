import React from "react";

export default function ChatCardItem({
  label,
  value,
}: {
    label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-y-1.5 text-sm font-medium">
      <span className="text-slate-400">{label}</span>
      <div className="flex items-center">{value}</div>
    </div>
  );
}
