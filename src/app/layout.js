import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import StoreProvider from "./providers/StoreProvider";
import { UIProvider } from "./providers/UIProvider";

import Footer from "@/components/Footer";

export const metadata = {
  title: "Pixel Guess: Guess Hidden Images by Pixel | Fun Image Guessing Game",
  description:
    "Join Pixel Guess and challenge yourself to guess hidden images, pixel by pixel. Choose your favorite category and start guessing today. Fun and addictive image guessing game for all ages.",
  author: "Pixel Guess",
  metadataBase: new URL("https://pixelguessgame.com"),
  openGraph: {
    title: "Pixel Guess: Guess Hidden Images by Pixel | Fun Image Guessing Game",
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
    title: "Pixel Guess: Guess Hidden Images by Pixel | Fun Image Guessing Game",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <GoogleAnalytics gaId="G-DP3HV72CNV" />
      <body className="bg-background">
        <UIProvider>
          <StoreProvider>
            <main className="!text-foreground mx-auto flex h-full min-h-dvh w-full max-w-4xl flex-col justify-between px-4 py-4 lg:px-8 lg:py-12">
              {children}
              <Footer />
            </main>
          </StoreProvider>
        </UIProvider>

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
