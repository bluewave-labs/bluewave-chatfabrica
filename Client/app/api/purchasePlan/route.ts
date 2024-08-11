import { lemonSqueezyApiInstance } from "@/lib/utils";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();

    if (!reqData.productId)
      return Response.json(
        { message: "productId is required" },
        { status: 400 }
      );

    if (!reqData.planId)
      return Response.json({ message: "planId is required" }, { status: 400 });

    if (!reqData.userId)
      return Response.json({ message: "userId is required" }, { status: 400 });

    const response = await lemonSqueezyApiInstance.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          custom_price: reqData.price,
          checkout_data: {
            custom: {
              user_id: reqData?.userId.toString(),
              plan_id: reqData?.planId.toString(),
              quantity: reqData?.quantity?.toString() || "1",
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMONSQUEEZY_STORE_ID!.toString(),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: reqData.productId.toString(),
            },
          },
        },
      },
    });

    const checkoutUrl = response.data.data.attributes.url;

    return Response.json({ checkoutUrl });
  } catch (error) {
    return Response.json({ message: "An error occurred" }, { status: 500 });
  }
}
