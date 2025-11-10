
import CurveFitPageClient from "./CurveFitPageClient";
import { formulas } from "@/lib/formulas";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  const formula = formulas.find((f) => f.id === "curve-fit");
  return {
    title: formula ? formula.title : "Laboratorio di Fisica",
  };
}

export default function CurveFitPage() {
    return <CurveFitPageClient id="curve-fit" />;
}
