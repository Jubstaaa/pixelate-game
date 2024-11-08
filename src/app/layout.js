import localFont from "next/font/local";
import "./globals.css";
import { DeviceIdProvider } from "./providers/DeviceIdProvider";
import UIProvider from "./providers/UIProvider";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import { ThemeProvider } from "./providers/ThemeProvider";
import ProgressBarProvider from "./providers/ProgressBarProvider";

export const metadata = {
  title: "Pixel Guess",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          enableColorScheme
        >
          <Toaster />
          <DeviceIdProvider>
            <UIProvider>
              <ReactQueryProvider>
                <ProgressBarProvider>
                  <main className="mx-auto flex flex-col justify-between w-full h-full max-w-4xl lg:px-8 lg:py-12 min-h-screen">
                    {children}
                    <Footer />
                  </main>
                </ProgressBarProvider>
              </ReactQueryProvider>
            </UIProvider>
          </DeviceIdProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
