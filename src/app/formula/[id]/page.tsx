
import { formulas } from "@/lib/formulas";
import FormulaPageClient from "./FormulaPageClient";
import { Metadata } from "next";

export async function generateStaticParams() {
  return formulas.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await params;
  const formula = formulas.find((f) => f.id === p.id);
  return {
    title: formula ? formula.title : "Laboratorio di Fisica",
  };
}

export default async function Page({ params }: { params: Promise<{ id: string | string[] }> }) {
  const p = await params;
  const id = Array.isArray(p.id) ? p.id[0] : p.id;
  return <FormulaPageClient id={id} />;
}
