import { withErrorHandling } from "@/lib/api/error-handler";
import { ApiResponse } from "@/lib/api/response";
import * as CharacterService from "@/services/character-service";

async function getHandler(request) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get("categoryId");

  if (!categoryId) {
    return ApiResponse.badRequest("categoryId is required");
  }

  const characters = await CharacterService.listByCategory(Number(categoryId));
  return ApiResponse.success(characters);
}

export const GET = withErrorHandling(getHandler);
