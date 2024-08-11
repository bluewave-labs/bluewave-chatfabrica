import React from "react";
import { LogOut } from "lucide-react";

import { signOut } from "@/auth";

import { Button } from "./ui/button";
import DeleteBotDialog from "./delete-bot-dialog";
import HelpButton from "./help-button";

export default function Logout() {
  return (
    <div className="flex flex-col gap-y-1 mt-auto">
      <DeleteBotDialog />
      <HelpButton />
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button
          type="submit"
          variant="ghost"
          className="flex items-center w-56 h-11 gap-x-2.5 px-3 hover:bg-slate-100 rounded-lg justify-start"
        >
          <LogOut />
          Logout
        </Button>
      </form>
    </div>
  );
}
