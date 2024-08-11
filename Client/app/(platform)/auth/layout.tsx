import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <header className="mt-[30px] ml-[27px] fixed top-0">
        <div>
        <Image
          className="shadow-logo rounded-lg"
          src={"/images/cflogo.png"}
          alt="duo-chat"
          width={95}
          height={95}
        />
        </div>
   
      </header>
      <main className="h-full  mt-14 lg:mt-10 px-6 sm:px-0">{children}</main>
    </div>
  );
}
