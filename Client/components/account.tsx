"use client";

import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Account({ name }: { name: string | null | undefined }) {
  return (
    <Link href={`/profile`} className="flex justify-center">
      <Avatar className="bg-muted items-center justify-center">
        <AvatarFallback>{name ? name.split(" ")?.[0][0] : ""}</AvatarFallback>
        {!name && (
          <AvatarImage
            src="/images/user.svg"
            className="w-5 h-5"
            width={20}
            height={20}
          />
        )}
      </Avatar>
    </Link>
  );
}
