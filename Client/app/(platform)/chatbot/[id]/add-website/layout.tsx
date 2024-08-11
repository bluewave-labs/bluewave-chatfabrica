import React from "react";

export default function AddWebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <main className="h-full">{children}</main>
    </div>
  );
}
