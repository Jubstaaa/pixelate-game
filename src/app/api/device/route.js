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

  if (!body.username) {
    return ApiResponse.badRequest("Username is required");
  }

  const existingDevice = await DeviceService.findById(deviceId);
  if (existingDevice?.username) {
    return ApiResponse.conflict("Device already has a username");
  }

  await DeviceService.upsert(deviceId, {
    username: body.username,
  });

  return ApiResponse.success({ message: "Device saved" });
});
