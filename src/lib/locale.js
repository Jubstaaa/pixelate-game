"use server";

import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import { getLanguages } from "./language";

// Cookie adı
const COOKIE_NAME = "NEXT_LOCALE";

// Kullanıcının dilini almak için fonksiyon
export async function getUserLocale() {
  // cookies() fonksiyonunu await ile kullanarak, doğru şekilde senkronize et
  const cookie = await cookies();
  const locale = cookie.get(COOKIE_NAME);
  const locales = await getLanguages();
  // Eğer cookie'de geçerli bir locale kodu varsa, locale'yi döndür
  // locale kodu 'code' özelliği üzerinden doğrulanır
  const userLocale = locales.find((l) => l.code === locale?.value);

  // Eğer geçerli bir locale bulunamazsa, defaultLocale kullan
  return userLocale ? userLocale.code : defaultLocale;
}

// Kullanıcının dilini değiştirmek için fonksiyon
export async function setUserLocale(locale) {
  const cookie = await cookies();
  const locales = await getLanguages();

  // Eğer gelen locale, geçerli locale listesinde değilse, defaultLocale'u kullan
  const validLocale = locales.find((l) => l.code === locale)
    ? locale
    : defaultLocale;

  // cookies() fonksiyonunu await ile kullanarak, doğru şekilde senkronize et
  cookie.set(COOKIE_NAME, validLocale);
}
