"use server";
import prisma from "@/lib/prisma"; // Prisma client import
import { getTranslations } from "next-intl/server";

export async function submitFeedback(values) {
  const f = await getTranslations("Footer.Feedback");

  try {
    // Insert the feedback into the database
    await prisma.feedback.create({
      data: values,
    });

    // Return success message
    return { message: f("ResponseMessage") };
  } catch (error) {
    return { error };
  }
}
