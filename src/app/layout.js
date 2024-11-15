import localFont from "next/font/local";
import "./globals.css";
import { DeviceIdProvider } from "./providers/DeviceIdProvider";
import UIProvider from "./providers/UIProvider";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import Footer from "@/components/Footer";
import { ThemeProvider } from "./providers/ThemeProvider";
import ProgressBarProvider from "./providers/ProgressBarProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-DP3HV72CNV" />
      <body className="bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          enableColorScheme
        >
          <DeviceIdProvider>
            <ReactQueryProvider>
              <ProgressBarProvider>
                <main className="mx-auto flex flex-col justify-between w-full h-full max-w-4xl px-4 py-4 lg:px-8 lg:py-12 min-h-dvh !text-foreground">
                  {children}
                  <Footer />
                </main>
                <Toaster
                  position="top-center"
                  richColors
                  toastOptions={{ duration: 2000 }}
                />
              </ProgressBarProvider>
            </ReactQueryProvider>
          </DeviceIdProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
