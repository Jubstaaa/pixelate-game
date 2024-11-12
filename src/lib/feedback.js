"use server";
import prisma from "@/lib/prisma"; // Prisma client import

export async function submitFeedback(values) {
  try {
    // Insert the feedback into the database
    await prisma.feedback.create({
      data: values,
    });

    // Return success message
    return { message: "Thanks for your feedback" };
  } catch (error) {
    return { error };
  }
}
