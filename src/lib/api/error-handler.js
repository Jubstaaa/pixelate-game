import { ApiResponse } from "./response";

export function handleApiError(error) {
  console.error("API Error:", error);

  if (error?.code === "P2002") {
    return ApiResponse.conflict("Unique constraint violation");
  }

  if (error?.code === "P2025") {
    return ApiResponse.notFound("Record not found");
  }

  if (error?.name === "ValidationError") {
    return ApiResponse.badRequest(error.message, error.details);
  }

  const message = error instanceof Error ? error.message : "Internal server error";

  return ApiResponse.internalError(message);
}

export function withErrorHandling(handler) {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.log(error);
      return handleApiError(error);
    }
  };
}
