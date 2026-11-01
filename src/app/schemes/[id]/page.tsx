import { notFound } from "next/navigation";
import { getSchemeById, getSchemes } from "@/lib/data";
import SchemeDetail from "./SchemeDetail";

// Build a static page for every scheme at build time (fast, good for Google search).
export async function generateStaticParams() {
  return (await getSchemes()).map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/schemes/[id]">) {
  const { id } = await params;
  const s = await getSchemeById(id);
  return { title: s ? `${s.name.en} | HaqSaathi` : "Scheme | HaqSaathi", description: s?.summary.en };
}

export default async function SchemePage({ params }: PageProps<"/schemes/[id]">) {
  const { id } = await params;
  const scheme = await getSchemeById(id);
  if (!scheme) notFound();
  return <SchemeDetail scheme={scheme} />;
}
