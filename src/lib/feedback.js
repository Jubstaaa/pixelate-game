"use server";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

export async function submitFeedback(values) {
  const f = await getTranslations("Footer.Feedback");

  try {
    await prisma.feedback.create({
      data: values,
    });

    return { message: f("ResponseMessage") };
  } catch (error) {
    return { error };
  }
}
