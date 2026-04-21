import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getEntitlementSummary } from "../../../../utils/billing";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Missing user email" }, { status: 400 });
  }

  const entitlement = await getEntitlementSummary(email);
  return NextResponse.json(entitlement);
}
