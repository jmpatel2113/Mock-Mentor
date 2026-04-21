import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";

export async function GET(_request, { params }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Missing user email" }, { status: 400 });
  }

  const [interview] = await db.select()
    .from(MockInterview)
    .where(
      and(
        eq(MockInterview.mockId, params.interviewId),
        eq(MockInterview.createdBy, email)
      )
    );

  if (!interview) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }

  return NextResponse.json({ interview });
}
