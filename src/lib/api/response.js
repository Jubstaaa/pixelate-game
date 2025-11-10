import { NextResponse } from "next/server";

export class ApiResponse {
  static success(data, status = 200) {
    return NextResponse.json({ data }, { status });
  }

  static error(message, status = 500, details = null) {
    const response = { error: message };
    if (details) {
      response.details = details;
    }
    return NextResponse.json(response, { status });
  }

  static badRequest(message = "Bad request", details = null) {
    return this.error(message, 400, details);
  }

  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401);
  }

  static notFound(message = "Resource not found") {
    return this.error(message, 404);
  }

  static methodNotAllowed(message = "Method not allowed") {
    return this.error(message, 405);
  }

  static conflict(message = "Conflict", details = null) {
    return this.error(message, 409, details);
  }

  static internalError(message = "Internal server error", details = null) {
    return this.error(message, 500, details);
  }
}
