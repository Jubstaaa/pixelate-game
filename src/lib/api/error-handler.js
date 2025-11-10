import { ApiResponse } from "./response";

/**
 * Centralized error handler for API routes
 * Handles Prisma errors, validation errors, and generic errors
 */
export function handleApiError(error) {
  console.error("API Error:", error);

  // Prisma errors
  if (error?.code === "P2002") {
    return ApiResponse.conflict("Unique constraint violation");
  }

  if (error?.code === "P2025") {
    return ApiResponse.notFound("Record not found");
  }

  // Validation errors
  if (error?.name === "ValidationError") {
    return ApiResponse.badRequest(error.message, error.details);
  }

  // Generic error
  const message = error instanceof Error ? error.message : "Internal server error";

  return ApiResponse.internalError(message);
}

/**
 * Wrapper for API route handlers with error handling
 */
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
