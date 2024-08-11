/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import PlanCard from "@/components/plan-card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plan, User, UserPlan } from "@/lib/definitions";
import React, { useEffect, useMemo, useState } from "react";
import ExtraPlans from "./extra-plan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import moment from "moment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import ApiKey from "./api-key";

export default function Plans({
  plans,
  activeUserPlan,
  user,
}: {
  plans: Plan[];
  activeUserPlan: UserPlan[];
  user: User | null;
}) {
  const totalMsgCredit = useMemo(() => {
    return activeUserPlan.reduce((acc, plan) => {
      return acc + plan.currentMessageCredits;
    }, 0);
  }, [activeUserPlan]);

  useEffect(() => {}, [window]);

  if (!user) {
    return (
      <div className="h-full space-y-7 md:ml-60">
        <h3 className="text-[32px] leading-8 text-black text-center md:text-start">
          Plans
        </h3>
        <p className="text-center md:text-start">
          Please sign in to view plans.
        </p>
      </div>
    );
  }

  /*

   <Tabs defaultValue="yearly" className="w-full">
        <TabsList>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <div className="grid place-items-center md:place-items-stretch grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-7">
            {plans
              .filter((plan) => plan.type === "Monthly")
              .map((plan) => (
                <PlanCard key={plan.id} plan={plan} user={user} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="yearly">
          <div className="grid place-items-center md:place-items-stretch grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-7">
            {plans
              .filter((plan) => plan.type === "Yearly")
              .map((plan) => (
                <PlanCard key={plan.id} plan={plan} user={user} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
 */

  return (
    <div className="h-full space-y-7 md:ml-60">
      <h3 className="text-[32px] leading-8 text-black text-center md:text-start">
        Plans
      </h3>

      <ExtraPlans user={user} activeUserPlan={activeUserPlan} />

      <Card className="shadow-secondary">
        <CardHeader>
          <CardTitle className="text-slate-700">Usage</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          {user?.userPlans.length > 0 && (
            <p>
              Your package will be renewed once a month. Next renewal:{" "}
              {moment(user?.userPlans[0]?.expiresAt).format("MMMM Do")}
            </p>
          )}
        </CardContent>
      </Card>
      <ApiKey />
    </div>
  );
}
