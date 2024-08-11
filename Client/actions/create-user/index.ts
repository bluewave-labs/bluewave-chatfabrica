"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CreateUser } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { email, password } = data;

  let user;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    user = await response.json();

    if (user.status !== "success") {
      return {
        error: user.name,
      };
    }
  } catch (error) {
    return {
      error: "User creation failed",
    };
  }

  revalidatePath(`/auth/signup`);
  return { data: user };
};

export const createUser = createSafeAction(CreateUser, handler);
