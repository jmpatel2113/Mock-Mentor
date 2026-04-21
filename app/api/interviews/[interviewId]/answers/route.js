import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "../../../../../../utils/db";
import { requestGeminiText } from "../../../../../../utils/gemini";
import { MockInterview, UserAnswer } from "../../../../../../utils/schema";

export async function POST(request, { params }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Missing user email" }, { status: 400 });
  }

  const { question, correctAnswer, userAnswer } = await request.json();
  const normalizedQuestion = `${question ?? ""}`.trim();
  const normalizedCorrectAnswer = `${correctAnswer ?? ""}`.trim();
  const normalizedUserAnswer = `${userAnswer ?? ""}`.trim();

  if (!normalizedQuestion || !normalizedCorrectAnswer || !normalizedUserAnswer || normalizedUserAnswer.length < 10) {
    return NextResponse.json({ error: "Missing or invalid answer payload" }, { status: 400 });
  }

  if (
    normalizedQuestion.length > 2000 ||
    normalizedCorrectAnswer.length > 8000 ||
    normalizedUserAnswer.length > 8000
  ) {
    return NextResponse.json({ error: "Answer payload exceeds allowed length" }, { status: 400 });
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

  const feedbackPrompt = `Question: ${normalizedQuestion}, User answer: ${normalizedUserAnswer}. Given the interview question and user's answer, please provide rating(1-10) and feedback as area of improvement for the user's answer. Provide the feedback in 3-5 sentences from 2nd person POV in JSON format as rating field and feedback field.`;
  const geminiResponse = await requestGeminiText(feedbackPrompt);
  const mockJsonResponse = geminiResponse.replace("```json", "").replace("```", "").trim();
  const feedback = JSON.parse(mockJsonResponse);

  await db.insert(UserAnswer).values({
    mockIdReference: interview.mockId,
    question: normalizedQuestion,
    correctAnswer: normalizedCorrectAnswer,
    userAnswer: normalizedUserAnswer,
    feedback: feedback.feedback,
    rating: `${feedback.rating ?? ""}`,
    userEmail: email,
    createdOn: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Answer recorded successfully",
    feedback,
  });
}
