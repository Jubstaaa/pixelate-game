import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(req) {
  const deviceIdCookie = req.cookies.get("device-id");

  // Eğer 'device-id' cookie yoksa yeni bir tane oluştur
  if (!deviceIdCookie) {
    const newDeviceId = uuidv4(); // Yeni bir unique ID oluştur
    const response = NextResponse.next();

    // Cookie ayarları ile 'device-id' ekle
    response.cookies.set("device-id", newDeviceId, {
      httpOnly: false, // Güvenlik için sadece sunucu tarafından erişilebilir
      sameSite: "strict", // CSRF koruması için
      maxAge: 60 * 60 * 24 * 365, // 1 yıl boyunca geçerli olacak
      path: "/", // Tüm yollar için geçerli kıl
    });

    return response;
  }

  // Eğer 'device-id' zaten varsa devam et
  return NextResponse.next();
}

// Middleware'in hangi yollar için geçerli olacağını belirleyin
export const config = {
  matcher: ["/"], // Ana sayfa ve alt sayfalar için middleware'i çalıştır
};
