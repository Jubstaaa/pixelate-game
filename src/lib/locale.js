"use server";

import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import { getLanguages } from "./language";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  const cookie = await cookies();
  const locale = cookie.get(COOKIE_NAME);
  const locales = await getLanguages();
  const userLocale = locales.find((l) => l.code === locale?.value);

  return userLocale ? userLocale.code : defaultLocale;
}

export async function setUserLocale(locale) {
  const cookie = await cookies();
  const locales = await getLanguages();

  const validLocale = locales.find((l) => l.code === locale)
    ? locale
    : defaultLocale;

  cookie.set(COOKIE_NAME, validLocale);
}
