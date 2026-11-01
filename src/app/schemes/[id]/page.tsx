import { notFound } from "next/navigation";
import { SCHEMES, getScheme } from "@/data/schemes";
import SchemeDetail from "./SchemeDetail";

// Build a static page for every scheme at build time (fast, good for Google search).
export function generateStaticParams() {
  return SCHEMES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/schemes/[id]">) {
  const { id } = await params;
  const s = getScheme(id);
  return { title: s ? `${s.name.en} | HaqSaathi` : "Scheme | HaqSaathi", description: s?.summary.en };
}

export default async function SchemePage({ params }: PageProps<"/schemes/[id]">) {
  const { id } = await params;
  const scheme = getScheme(id);
  if (!scheme) notFound();
  return <SchemeDetail scheme={scheme} />;
}
