
import FormulaPageClient from "../FormulaPageClient";
import { formulas } from "@/lib/formulas";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const formula = formulas.find((f) => f.id === "absolute-relative-errors");
  return {
    title: formula ? formula.title : "Laboratorio di Fisica",
  };
}

export default function AbsoluteRelativeErrorsPage() {
    return <FormulaPageClient id="absolute-relative-errors" />;
}
