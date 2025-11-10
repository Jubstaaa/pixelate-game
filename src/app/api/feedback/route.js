import { NextResponse } from "next/server";

import * as FeedbackService from "@/services/feedback-service";

export async function POST(request) {
  try {
    const payload = await request.json();
    const { feedback, rating } = payload ?? {};

    if (!feedback || typeof feedback !== "string") {
      return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
    }

    const result = await FeedbackService.submitFeedback({ feedback, rating: rating ?? null });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit feedback.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
