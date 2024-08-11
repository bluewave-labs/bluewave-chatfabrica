"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { SubscribePlan } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to subscribe to a plan",
    };
  }

  const { planId, userId } = data;

  let plan;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/plans/${planId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    plan = await response.json();

    if (plan.status !== "success") {
      return {
        error: plan.message,
      };
    }
  } catch (error) {
    return {
      error: "Plan subscription failed",
    };
  }

  revalidatePath(`/profile`);
  return { data: plan };
};

export const subscribePlan = createSafeAction(SubscribePlan, handler);
