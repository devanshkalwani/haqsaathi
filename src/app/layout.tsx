import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "HaqSaathi: find the benefits you deserve",
  description:
    "Find government schemes you are eligible for, understand them in simple Hindi or English, and learn exactly how to apply. Independent project, not a government website.",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
