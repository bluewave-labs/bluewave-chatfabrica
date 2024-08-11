import React from "react";
import Plans from "./_components/plans";
import { Plan, User, UserPlan } from "@/lib/definitions";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

async function fetchPlans(): Promise<Plan[] | []> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/plans`
    );
    const plans = await response.json();

    if (plans.status !== "success") {
      return [];
    }

    return plans.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function activePlan(): Promise<UserPlan[]> {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/active-plan`,
      {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      }
    );
    const plan = await response.json();

    if (plan.status !== "success") {
      return [];
    }

    return plan.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchUser(): Promise<User | null> {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      }
    );
    const user = await response.json();

    if (user.status !== "success") {
      return null;
    }

    return user.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ProfilePage() {
  const plans = await fetchPlans();
  const activeUserPlan = await activePlan();
  const user = await fetchUser();

  return (
    <div className="md:ml-[50px]">
      <Plans plans={plans} activeUserPlan={activeUserPlan} user={user} />
    </div>
  );
}
