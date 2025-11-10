import { withErrorHandling } from "@/lib/api/error-handler";
import { ApiResponse } from "@/lib/api/response";
import { updateUsername } from "@/services/leaderboard-service";

async function postHandler(request) {
  const deviceId = request.headers.get("x-device-id");

  if (!deviceId) {
    return ApiResponse.badRequest("Device ID header missing");
  }

  const body = await request.json();
  const username = body?.username?.trim();

  if (!username) {
    return ApiResponse.badRequest("Username is required");
  }

  const result = await updateUsername(deviceId, username);

  if (result.error) {
    return ApiResponse.error(result.error, 400);
  }

  return ApiResponse.success(result);
}

export const POST = withErrorHandling(postHandler);
