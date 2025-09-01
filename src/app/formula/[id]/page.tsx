import { formulas } from "@/lib/formulas";
import FormulaPageClient from "./FormulaPageClient";

// Pre-render all formula pages for static export (GitHub Pages)
export function generateStaticParams() {
  return formulas.map((f) => ({ id: f.id }));
}

export default function Page({ params }: { params: { id: string | string[] } }) {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  return <FormulaPageClient id={id} />;
}
