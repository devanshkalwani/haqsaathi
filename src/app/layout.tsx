import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { DataProvider } from "@/lib/data-context";
import { getDocuments, getSchemes } from "@/lib/data";

export const metadata: Metadata = {
  title: "HaqSaathi: find the benefits you deserve",
  description:
    "Find government schemes you are eligible for, understand them in simple Hindi or English, and learn exactly how to apply. Independent project, not a government website.",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Load scheme data once on the server (cached) and share it with every page.
  const [schemes, documents] = await Promise.all([
    getSchemes(),
    getDocuments(),
  ]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <DataProvider schemes={schemes} documents={documents}>
          <LanguageProvider>
            <AuthProvider>
              {/* Header reads the current URL, so it streams in on pages that are built per request */}
              <Suspense>
                <Header />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </DataProvider>
      </body>
    </html>
  );
}
