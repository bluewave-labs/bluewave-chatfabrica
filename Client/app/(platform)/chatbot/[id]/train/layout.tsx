import React from "react";

export default function TrainLayout({
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
