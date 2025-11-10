import { withErrorHandling } from "@/lib/api/error-handler";
import { ApiResponse } from "@/lib/api/response";
import * as GameService from "@/services/game-service";

async function getHandler(request) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get("categoryId");
  const levelType = searchParams.get("level_type");
  const deviceId = request.headers.get("x-device-id");

  if (!deviceId) {
    return ApiResponse.error("Device ID header missing", 400);
  }

  const response = await GameService.getGameData(categoryId, levelType, deviceId);
  return ApiResponse.success(response);
}

async function postHandler(request) {
  const { id, categoryId, level_type } = await request.json();
  const deviceId = request.headers.get("x-device-id");

  if (!deviceId) {
    return ApiResponse.error("Device ID header missing", 400);
  }

  const result = await GameService.submitGuess(id, categoryId, level_type, deviceId);

  if (result.isError) {
    return ApiResponse.error(result.message, 400);
  }

  return ApiResponse.success(result);
}

export const GET = withErrorHandling(getHandler);
export const POST = withErrorHandling(postHandler);
