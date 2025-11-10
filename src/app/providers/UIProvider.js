"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

export function UIProvider({ children }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
}
