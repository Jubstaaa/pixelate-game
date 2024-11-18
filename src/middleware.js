import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { defaultLocale } from "@/i18n/config"; // locales ve defaultLocale'ı uygun şekilde import et
import { getLanguages } from "./lib/language";

export function middleware(req) {
  const deviceIdCookie = req.cookies.get("device-id");

  console.log(req.nextUrl.href);
  console.log(deviceIdCookie);

  // Eğer 'device-id' cookie yoksa yeni bir tane oluştur
  if (!deviceIdCookie) {
    const newDeviceId = uuidv4(); // Yeni bir unique ID oluştur
    const response = NextResponse.next();

    // Cookie ayarları ile 'device-id' ekle
    response.cookies.set("device-id", newDeviceId, {
      httpOnly: true, // Tarayıcıdan erişilebilir (client-side erişim için)
      sameSite: "strict", // CSRF koruması için
      maxAge: 60 * 60 * 24 * 365, // 1 yıl boyunca geçerli olacak
      path: "/", // Tüm yollar için geçerli
    });

    // Locale detection
    const acceptLanguage = req.headers.get("accept-language") || "";
    const detectedLocale = detectLocale(acceptLanguage);

    // Eğer 'locale' cookie yoksa veya yanlışsa, locale'yi ayarla
    response.cookies.set("locale", detectedLocale, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365, // 1 yıl boyunca geçerli
      path: "/",
    });

    return response;
  }

  // Eğer 'device-id' zaten varsa, locale'yi kontrol et
  const response = NextResponse.next();
  const acceptLanguage = req.headers.get("accept-language") || "";
  const detectedLocale = detectLocale(acceptLanguage);

  // Locale cookie'sini ayarla
  response.cookies.set("locale", detectedLocale, {
    httpOnly: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return response;
}

// Locale tespiti yapmak için bir yardımcı fonksiyon
function detectLocale(acceptLanguage) {
  // Accept-Language başlığından dili ayıkla
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim());
  // Geçerli bir locale olup olmadığını kontrol et

  // Eğer geçerli bir locale varsa onu döndür, yoksa default locale'ı döndür
  return languages[0] || defaultLocale;
}

// Middleware'in hangi yollar için geçerli olacağını belirleyin
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico|site.webmanifest).*)",
  ], // `favicon.ico`, görsel ve API yollarını hariç tut
};
