import React from "react";
interface UploadImageCardProps {
    text: string;
}

export default function UploadImageCard({text}: UploadImageCardProps) {
  return (
    <div className="flex mt-8 w-full flex-row items-center gap-4 py-3">
      <div className="h-14 w-14 rounded-full border border-zinc-300 bg-zinc-200"></div>
      <div className="flex flex-col gap-1">
        <span className="mb-1 block text-sm font-medium text-zinc-700">
            {text}
          
        </span>
        <div className="flex flex-row items-center gap-2">
          <input
            id="bot_profile_picture"
            accept="image/*"
            className="hidden"
            type="file"
            name="bot_profile_picture"
          />
          <button
            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-7 rounded-md px-3 text-xs"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-upload mr-2 h-4 w-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" x2="12" y1="3" y2="15"></line>
            </svg>
            Upload image
          </button>
        </div>
        <span className="mt-1 text-xs text-zinc-500">
          Supports JPG, PNG, and SVG files up to 1MB
        </span>
      </div>
    </div>
  );
}
