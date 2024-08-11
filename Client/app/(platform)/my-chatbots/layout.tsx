import { auth } from "@/auth";
import Account from "@/components/account";
import Image from "next/image";
import React from "react";

export default async function MyChatBotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="h-full">
      <header className="mt-[30px] px-[27px] h-40 sm:h-auto flex items-center justify-between fixed top-0 w-full">
        <Image
          className="shadow-logo rounded-lg"
          src={"/images/cflogo.png"}
          alt="CF"
          width={95}
          height={95}
        />
        <div>
          <Account name={session?.user.name} />
        </div>
      </header>
      <main className="h-full">{children}</main>
    </div>
  );
}
