"use server";

import prisma from "@/lib/prisma";

const FEEDBACK_SUCCESS_MESSAGE = "Thanks for your feedback!";

export async function submitFeedback(values) {
  try {
    await prisma.feedback.create({
      data: values,
    });

    return { message: FEEDBACK_SUCCESS_MESSAGE };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
