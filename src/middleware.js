import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { defaultLocale } from "@/i18n/config";

export function middleware(req) {
  const deviceIdCookie = req.cookies.get("device-id");

  if (!deviceIdCookie) {
    const newDeviceId = uuidv4();
    const response = NextResponse.next();

    response.cookies.set("device-id", newDeviceId, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    const acceptLanguage = req.headers.get("accept-language") || "";
    const detectedLocale = detectLocale(acceptLanguage);

    response.cookies.set("locale", detectedLocale, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  }

  const response = NextResponse.next();
  const acceptLanguage = req.headers.get("accept-language") || "";
  const detectedLocale = detectLocale(acceptLanguage);

  response.cookies.set("locale", detectedLocale, {
    httpOnly: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return response;
}

function detectLocale(acceptLanguage) {
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim());

  return languages[0] || defaultLocale;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico|site.webmanifest).*)",
  ],
};
