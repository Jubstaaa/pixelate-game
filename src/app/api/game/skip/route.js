import { withErrorHandling } from "@/lib/api/error-handler";
import { ApiResponse } from "@/lib/api/response";
import * as GameService from "@/services/game-service";

async function postHandler(request) {
  const { categoryId, level_type } = await request.json();
  const deviceId = request.headers.get("x-device-id");

  if (!deviceId) {
    return ApiResponse.error("Device ID header missing", 400);
  }

  const result = await GameService.handleSkip(categoryId, level_type, deviceId);
  return ApiResponse.success(result);
}

export const POST = withErrorHandling(postHandler);
