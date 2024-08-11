import React, { useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import axios from "axios";
import { User } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

interface ExtraPlanCardProps {
  title: string;
  description: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  price?: number;
  text: string;
  showInput: boolean;
  min?: number;
  mainPrice?: number;
  purchasePrice?: number;
  variantId?: string;
  user?: User | null;
  planId: string;
  planName: string;
  quantity: number;
  disabled?: boolean;
  buyed?: boolean;
}

export default function ExtraPlanCard({
  title,
  description,
  step,
  value,
  setValue,
  price,
  text,
  showInput,
  min = 0,
  mainPrice,
  purchasePrice,
  variantId,
  user,
  planId,
  quantity,
  disabled,
  buyed,
}: ExtraPlanCardProps) {
  const [link, setLink] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    (async function getLink() {
      setLoading(true);
      const response = await axios.post("/api/purchasePlan", {
        productId: variantId,
        userId: user?.id,
        price: purchasePrice,
        planId,
        quantity,
      });

      let url = response.data.checkoutUrl;

      setLink(url);
      setLoading(false);
    })();
  }, [purchasePrice, quantity, user?.id, planId, variantId]);

  const handleSearch = useDebouncedCallback((term) => {
    setValue(term);
  }, 300);

  return (
    <div>
      <Card className="w-[344px]  p-0 shadow-secondary  ">
        <CardContent className="py-[25px] flex flex-col gap-y-5">
          <h3 className="text-xl font-semibold text-[#000]">{title}</h3>
          <p className="font-medium text-sm text-[#334155]">
            {mainPrice ? `$` + mainPrice : null} {description}
          </p>
          {showInput && (
            <div className="flex gap-x-2">
              <input
                className="w-[88px] outline-none h-7 border rounded-[6px] px-3 py-2"
                defaultValue={value}
                onChange={(e) => handleSearch(e.target.value)}
                step={step}
                type="number"
                min={min}
              />
              <span className="font-medium text-[#334155]">{text}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base text-[#334155]">${price}</span>
              <span className="text-xs text-[#334155]">Total per month</span>
            </div>
            <a
              target="_blank"
              className={cn(
                "lemonsqueezy-button w-[139px] border",
                (disabled || loading) && "bg-[#F2F4F8] text-[#B0BAC9]",
                buttonVariants({
                  variant: "ghost",
                })
              )}
              href={disabled || loading ? "#" : link}
            >
              {buyed ? "Purchased" : "Get add-on"}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
