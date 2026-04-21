import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "../../../utils/db";
import { requestGeminiText } from "../../../utils/gemini";
import { getEntitlementSummary } from "../../../utils/billing";
import { MockInterview } from "../../../utils/schema";

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

  const { jobPosition, jobDescription, jobExperience } = await request.json();
  const normalizedJobPosition = `${jobPosition ?? ""}`.trim();
  const normalizedJobDescription = `${jobDescription ?? ""}`.trim();
  const normalizedJobExperience = `${jobExperience ?? ""}`.trim();

  if (!normalizedJobPosition || !normalizedJobDescription || !normalizedJobExperience) {
    return NextResponse.json({ error: "Missing required interview details" }, { status: 400 });
  }

  if (
    normalizedJobPosition.length > 150 ||
    normalizedJobDescription.length > 4000 ||
    normalizedJobExperience.length > 20
  ) {
    return NextResponse.json({ error: "Interview details exceed allowed length" }, { status: 400 });
  }

  const entitlement = await getEntitlementSummary(email);

  if (!entitlement.canCreate) {
    return NextResponse.json({
      error: "Interview quota reached",
      entitlement,
    }, { status: 403 });
  }

  const questionCount = process.env.INTERVIEW_QUESTION_COUNT || "5";
  const inputPrompt = `Job Position: ${normalizedJobPosition}, Job Description: ${normalizedJobDescription}, Years of Experience: ${normalizedJobExperience}, Based on this information, please give me ${questionCount} interview questions with answers in JSON format. Use Question and Answer as the JSON fields.`;
  const geminiResponse = await requestGeminiText(inputPrompt);
  const mockJsonResponse = geminiResponse.replace("```json", "").replace("```", "").trim();

  JSON.parse(mockJsonResponse);

  const createdOn = new Date().toISOString();
  const response = await db.insert(MockInterview).values({
    mockId: uuidv4(),
    jsonMockResponse: mockJsonResponse,
    jobPosition: normalizedJobPosition,
    jobDescription: normalizedJobDescription,
    jobExperience: normalizedJobExperience,
    createdBy: email,
    createdOn,
  }).returning({ mockId: MockInterview.mockId });

  return NextResponse.json({
    mockId: response[0]?.mockId,
  }, { status: 201 });
}
