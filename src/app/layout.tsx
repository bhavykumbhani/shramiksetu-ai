import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import ChatWidget from "@/components/ui/ChatWidget";
import BhashaMitraWidget from "@/components/ui/BhashaMitraWidget";
import Footer from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShramikSetu AI | Smart Migrant Welfare",
  description: "Your Skills. Your Rights. Your Support — Wherever You Work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LanguageProvider>
          <main className="flex-grow flex flex-col relative z-0">
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <BhashaMitraWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
