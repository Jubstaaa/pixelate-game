import prisma from "./prisma";

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function logout() {
  sessionStorage.removeItem("adminToken");
}

// Client-side auth utilities
export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false; // Server-side'da her zaman false dön
  }
  return document.cookie.includes("adminToken=");
}

// Auth middleware for API routes
export function withAuth(handler) {
  return async (req, res) => {
    const token = req.cookies.get("adminToken")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // Decode token and verify user exists
      const decoded = atob(token);
      const [email] = decoded.split(":");

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Invalid token");
      }

      return handler(req, res);
    } catch (error) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}
