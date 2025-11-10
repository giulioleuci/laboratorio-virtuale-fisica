
import ErrorPropagationPageClient from "./ErrorPropagationPageClient";
import { formulas } from "@/lib/formulas";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  const formula = formulas.find((f) => f.id === "error-propagation");
  return {
    title: formula ? formula.title : "Laboratorio di Fisica",
  };
}

export default function ErrorPropagationPage() {
    return <ErrorPropagationPageClient id="error-propagation" />;
}
