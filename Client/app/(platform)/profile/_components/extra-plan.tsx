"use client";

import ExtraPlanCard from "@/components/extra-plan-card";
import { CardTitle } from "@/components/ui/card";
import { User, UserPlan } from "@/lib/definitions";
import React, { useMemo } from "react";

export default function ExtraPlans({
  user,
  activeUserPlan,
}: {
  user: User | null;
  activeUserPlan: UserPlan[];
}) {
  const pricePerExtra = 3;
  const [messageCredits, setMessageCredits] = React.useState(1000);
  const [chatbots, setChatbots] = React.useState(1);

  const calculateMessagePrice = (quantity: number) => {
    return (quantity / 1000) * pricePerExtra;
  };

  const calculateChatbotPrice = (quantity: number) => {
    return quantity * pricePerExtra;
  };

  const activeRemoveBranding = useMemo(() => {
    return !!activeUserPlan.filter(
      (userPlan) =>
        userPlan.plan.name === "RemoveBranding" &&
        new Date(userPlan.expiresAt) > new Date()
    )?.length;
  }, [activeUserPlan]);

  const activePlansWithoutFree = useMemo(() => {
    return activeUserPlan.filter((userPlan) => !userPlan.plan.isFree);
  }, [activeUserPlan]);
  /*
<ExtraPlanCard
          title="Extra message credits"
          description=" per 1000 messages/month"
          price={calculateMessagePrice(messageCredits)}
          text="extra message credits"
          mainPrice={3}
          showInput={true}
          variantId="381590"
          value={messageCredits}
          setValue={setMessageCredits}
          purchasePrice={pricePerExtra! * (messageCredits / 10)}
          step={1000}
          min={1000}
          planId="88241202-8fcb-47cb-8360-376c5eec18b2"
          planName="credit"
          user={user}
          quantity={messageCredits / 1000}
          disabled={activePlansWithoutFree.length === 0}
        /><ExtraPlanCard
          title="Extra chatbot"
          description="per extra chatbot"
          price={calculateChatbotPrice(chatbots)}
          text="extra chatbots"
          mainPrice={3}
          variantId="381589"
          showInput={true}
          value={chatbots}
          setValue={setChatbots}
          purchasePrice={pricePerExtra! * (chatbots * 100)}
          step={1}
          planId="5ad62484-ed93-41d7-8b15-73ca4032a538"
          planName="chatbot"
          user={user}
          quantity={chatbots}
          disabled={activePlansWithoutFree.length === 0}
        />*/
  return (
    <>
      <div className="grid place-items-center md:place-items-stretch grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-7">
        <ExtraPlanCard
          title="Remove 'Powered By ChatFabrica'"
          description="Remove 'Powered By ChatFabrica' branding from the iframe and widget for $29/month"
          price={29}
          text="extra chatbots"
          showInput={false}
          value={chatbots}
          setValue={setChatbots}
          purchasePrice={2900}
          variantId="381594"
          step={1}
          planId="fb5b2733-471f-4804-b799-89a3101ad672"
          planName="remove-branding"
          user={user}
          quantity={1}
          disabled={activeRemoveBranding}
          buyed={activeRemoveBranding}
        />
      </div>
    </>
  );
}
