import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dompetku",
  description: "Aplikasi Keuangan Pribadi Mobile-First",
  manifest: "/manifest.ts",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} antialiased h-full`}>
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen`}
      >
        <SplashScreen />
        <div className="mobile-container pb-16">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
