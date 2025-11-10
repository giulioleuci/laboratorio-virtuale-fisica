
import FormulaPageClient from "../FormulaPageClient";
import { formulas } from "@/lib/formulas";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const formula = formulas.find((f) => f.id === "uncertainty-measurement");
  return {
    title: formula ? formula.title : "Laboratorio di Fisica",
  };
}

export default function UncertaintyMeasurementPage() {
    return <FormulaPageClient id="uncertainty-measurement" />;
}
