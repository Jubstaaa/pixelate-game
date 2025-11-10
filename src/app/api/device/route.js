"use server";

import { withErrorHandling } from "@/lib/api/error-handler";
import { ApiResponse } from "@/lib/api/response";
import * as DeviceService from "@/services/device-service";

export const GET = withErrorHandling(async (req) => {
  const deviceId = req.headers.get("x-device-id");
  if (!deviceId) {
    return ApiResponse.badRequest("Missing x-device-id header");
  }

  let device = await DeviceService.findOrCreate(deviceId);

  return ApiResponse.success(device);
});

export const POST = withErrorHandling(async (req) => {
  const deviceId = req.headers.get("x-device-id");
  if (!deviceId) {
    return ApiResponse.badRequest("Missing x-device-id header");
  }

  const body = await req.json().catch(() => ({}));
  const username = typeof body?.username === "string" ? body.username.trim() : "";

  if (!username) {
    return ApiResponse.badRequest("Username is required");
  }

  await DeviceService.upsert(deviceId, {
    username,
  });

  return ApiResponse.success({ message: "Device saved" });
});
