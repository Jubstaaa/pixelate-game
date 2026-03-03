import { withErrorHandling } from "@/lib/api/error-handler";
import { ApiResponse } from "@/lib/api/response";
import * as CategoryService from "@/services/category-service";

async function getHandler() {
  const categories = await CategoryService.list();
  return ApiResponse.success(categories);
}

export const GET = withErrorHandling(getHandler);
