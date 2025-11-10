import { withErrorHandling } from "@/lib/api/error-handler";
import { ApiResponse } from "@/lib/api/response";
import { getLeaderboard } from "@/services/leaderboard-service";

async function getHandler(request) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get("categoryId");
  const levelType = searchParams.get("level_type");

  if (!categoryId || levelType == null) {
    return ApiResponse.badRequest("categoryId and level_type are required");
  }

  const leaderboard = await getLeaderboard(Number(categoryId), Number(levelType));
  return ApiResponse.success(leaderboard);
}

export const GET = withErrorHandling(getHandler);
