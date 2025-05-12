import { getLatestValorantAgents } from "@/lib/getLatestValorantAgents";
import { withAuth } from "@/lib/auth";

async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await getLatestValorantAgents();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error importing Valorant agents:", error);
    return new Response(JSON.stringify({ error: "Failed to import agents" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const POST = withAuth(handler);
