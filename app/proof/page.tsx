import type { Metadata } from "next";
import { ProofPage } from "@/components/pages/ProofPage";

export const metadata: Metadata = {
  title: "Proof — Curiosity Inc",
  description: "The artifacts behind the systems. Evidence of rigor.",
};

export default function Proof() {
  return <ProofPage />;
}
