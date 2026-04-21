import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAppUrl } from "../../../../utils/app-url";
import { getLatestSubscriptionByEmail } from "../../../../utils/billing";

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

  const subscription = await getLatestSubscriptionByEmail(email);

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "No active billing account found" }, { status: 404 });
  }

  const appUrl = getAppUrl(request);
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${appUrl}/upgrade`,
  });

  return NextResponse.json({ url: portalSession.url });
}
