/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Plan, User } from "@/lib/definitions";
import axios from "axios";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

interface PlanCardProps {
  plan: Plan;
  user?: User | null;
}

export default function PlanCard({ plan, user }: PlanCardProps) {
  const [link, setLink] = React.useState<string>("");

  const onClick = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/purchasePlan", {
        productId: plan.variantId,
        planId: plan.id,
        userId: user?.id,
      });

      window.open(response.data.checkoutUrl, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  const currentPlan = useMemo(() => {
    return !!user?.userPlans.find((userPlan) => userPlan.planId === plan.id);
  }, [user, plan]);

  useEffect(() => {
    (async function getLink() {
      const response = await axios.post("/api/purchasePlan", {
        productId: plan.variantId,
        planId: plan.id,
        userId: user?.id,
      });

      let url = response.data.checkoutUrl;

      setLink(url);
    })();
  }, []);

  return (
    <Card className="w-[344px] p-0 shadow-secondary border border-indigo-600">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex-row font-semibold text-2xl">
          {plan.name}
        </CardTitle>
        <h3 className="font-medium text-base">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          })
            .format(plan.price)
            .replace(".00", "")}
          /{plan.type === "Monthly" ? "month" : "year"}
        </h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-5 text-sm font-semibold">
          <li>{plan.messageCredits} message credits/month</li>
          <li>{plan.chatbots + 1} chatbot</li>
          <li>{plan.charactersPerChatbot} characters/chatbot</li>
          <li>Unlimited links to train on</li>
          {plan.embedOnWebsites && <li>Embed on unlimited websites</li>}
          {plan.uploadFiles && <li>Upload multiple files</li>}
          {plan.viewConversationHistory && <li>View conversation history</li>}
        </ul>
      </CardContent>
      <CardFooter>
        <form className="w-full">
          <a
            target="_blank"
            className={cn(
              "lemonsqueezy-button w-full",
              buttonVariants({
                variant: currentPlan ? "secondary" : "default",
              })
            )}
            href={currentPlan ? "#" : link}
          >
            {currentPlan ? "Your Current Plan" : "Choose Plan"}
          </a>
        </form>
      </CardFooter>
    </Card>
  );
}
