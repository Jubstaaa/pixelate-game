import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import Footer from "@/components/Footer";
import { ThemeProvider } from "./providers/ThemeProvider";
import ProgressBarProvider from "./providers/ProgressBarProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getLanguages } from "@/lib/language";
import { getPatchNotes } from "@/lib/patchNote";
import Script from "next/script";

export const metadata = {
  title: "Pixel Guess: Guess Hidden Images by Pixel | Fun Image Guessing Game",
  description:
    "Join Pixel Guess and challenge yourself to guess hidden images, pixel by pixel. Choose your favorite category and start guessing today. Fun and addictive image guessing game for all ages.",
  author: "Pixel Guess",
  metadataBase: new URL("https://pixelguessgame.com"),
  openGraph: {
    title:
      "Pixel Guess: Guess Hidden Images by Pixel | Fun Image Guessing Game",
    description:
      "Join Pixel Guess and challenge yourself to guess hidden images, pixel by pixel. Choose your favorite category and start guessing today. Fun and addictive image guessing game for all ages.",
    url: "https://pixelguessgame.com",
    siteName: "Pixel Guess",
    images: [
      {
        url: "https://pixelguessgame.com/images/pixel_guess_logo.webp",
        width: 521,
        height: 521,
        alt: "Pixel Guess: Fun Image Guessing Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pixel Guess: Guess Hidden Images by Pixel | Fun Image Guessing Game",
    description:
      "Join Pixel Guess and challenge yourself to guess hidden images, pixel by pixel. Fun and addictive image guessing game for all ages.",
    images: ["https://pixelguessgame.com/images/pixel_guess_logo.webp"],
  },
  robots: "index, follow",
  icons: {
    icon: "/android-chrome-192x192.png",
    apple: "/apple-touch-icon.png",
    android: "/android-chrome-192x192.png",
    "favicon-16x16": "/favicon-16x16.png",
    "favicon-32x32": "/favicon-32x32.png",
    "favicon.ico": "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Pixel Guess",
  genre: "Puzzle",
  url: "https://pixelguessgame.com",
  description:
    "Join Pixel Guess and challenge yourself to guess hidden images, pixel by pixel. Fun and addictive image guessing game for all ages.",
  image: "https://pixelguessgame.com/images/pixel_guess_logo.webp",
  publisher: {
    "@type": "Organization",
    name: "Pixel Guess",
    logo: {
      "@type": "ImageObject",
      url: "https://pixelguessgame.com/images/pixel_guess_logo.webp",
      width: 521,
      height: 521,
    },
  },
  mainEntityOfPage: "https://pixelguessgame.com",
  gamePlatform: "Web",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "0.00",
    url: "https://pixelguessgame.com",
  },
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  const messages = await getMessages();
  const locales = await getLanguages();
  const patchNotes = await getPatchNotes(locale);

  return (
    <html lang={locale}>
      <GoogleAnalytics gaId="G-DP3HV72CNV" />
      <body className="bg-background">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            enableColorScheme
          >
            <ReactQueryProvider>
              <ProgressBarProvider>
                <main className="mx-auto flex flex-col justify-between w-full h-full max-w-4xl px-4 py-4 lg:px-8 lg:py-12 min-h-dvh !text-foreground">
                  {children}
                  <Footer locales={locales} patchNotes={patchNotes} />
                </main>
                <Toaster
                  position="top-center"
                  richColors
                  toastOptions={{ duration: 2000 }}
                />
              </ProgressBarProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>

        <SpeedInsights />
        <Analytics />
        <Script
          id="Schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NODE_ENV === "production" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2149079899242374`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
