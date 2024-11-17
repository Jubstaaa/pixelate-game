"use server";

import { cookies } from "next/headers";
import { locales, defaultLocale } from "@/i18n/config";

// In this example the locale is read from a cookie.
// If the locale is not found, it will use the defaultLocale.

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  // cookies() fonksiyonunu await ile kullanarak, doğru şekilde senkronize et
  const cookie = await cookies();
  const locale = cookie.get(COOKIE_NAME);

  // Eğer cookie'de geçerli bir locale yoksa, defaultLocale kullan
  return locales.includes(locale?.value) ? locale.value : defaultLocale;
}

export async function setUserLocale(locale) {
  const cookie = await cookies();

  // Eğer gelen locale, desteklenen diller arasında değilse, defaultLocale'u kullan
  const validLocale = locales.includes(locale) ? locale : defaultLocale;

  // cookies() fonksiyonunu await ile kullanarak, doğru şekilde senkronize et
  cookie.set(COOKIE_NAME, validLocale);
}
