import React from "react";

export default function Status({ value }: { value: "Active" | "Failed" }) {
  return (
    <div className="flex flex-col gap-y-1.5 text-sm font-medium">
      <span className="text-slate-400">Status</span>
      <div className="flex items-center gap-x-2">
        {value === "Active" ? (
          <div className="bg-green-600 w-4 h-4 rounded-full" />
        ) : (
          <div className="bg-red-600 w-4 h-4 rounded-full" />
        )}
        {value}
      </div>
    </div>
  );
}
