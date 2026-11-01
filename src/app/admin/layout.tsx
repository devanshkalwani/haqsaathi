import { Suspense } from "react";

export const metadata = { title: "Admin | HaqSaathi", robots: { index: false } };

/**
 * Admin pages read cookies and the live database, so they render on each request.
 * Suspense lets Next.js handle that while the rest of the site stays static and fast.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Suspense fallback={<p className="text-gray-500">Loading…</p>}>{children}</Suspense>
    </div>
  );
}
