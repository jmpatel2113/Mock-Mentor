import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAppUrl } from "../../../../utils/app-url";
import { getPlanDetails, getStripePriceId } from "../../../../utils/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export const runtime = "nodejs";

export async function POST(request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Missing user email" }, { status: 400 });
  }

  const { planKey } = await request.json();
  const plan = getPlanDetails(planKey);
  const priceId = getStripePriceId(planKey);

  if (!plan || !priceId) {
    return NextResponse.json({ error: "Invalid plan selection" }, { status: 400 });
  }

  const appUrl = getAppUrl(request);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: `${appUrl}/upgrade?checkout=success`,
    cancel_url: `${appUrl}/upgrade?checkout=cancelled`,
    metadata: {
      planKey: plan.planKey,
      quotaLimit: `${plan.quotaLimit}`,
      userEmail: email,
      userId,
    },
    subscription_data: {
      metadata: {
        planKey: plan.planKey,
        quotaLimit: `${plan.quotaLimit}`,
        userEmail: email,
        userId,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
