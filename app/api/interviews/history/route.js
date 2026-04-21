import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "../../../../utils/db";
import { MockInterview } from "../../../../utils/schema";

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

  const interviews = await db.select({
    id: MockInterview.id,
    mockId: MockInterview.mockId,
    jobPosition: MockInterview.jobPosition,
    jobDescription: MockInterview.jobDescription,
    jobExperience: MockInterview.jobExperience,
    createdOn: MockInterview.createdOn,
  })
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));

  return NextResponse.json({ interviews });
}
