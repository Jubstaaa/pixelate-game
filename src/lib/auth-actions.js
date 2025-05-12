"use server";

import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import prisma from "./prisma";

export async function loginAction(email, password) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid credentials" };
    }

    // Create session token
    const token = btoa(`${user.email}:${Date.now()}`);
    (await cookies()).set("adminToken", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function logoutAction() {
  await cookies().delete("adminToken");
  return { success: true };
}

// Utility function to create an admin user (to be used manually)
export async function createAdminUser(email, password) {
  try {
    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return { success: true, user };
  } catch (error) {
    console.error("Create admin error:", error);
    return { success: false, error: "Failed to create admin user" };
  }
}
