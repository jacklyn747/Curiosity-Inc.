import type { Metadata } from "next";
import { BuildsPage } from "@/components/pages/BuildsPage";

export const metadata: Metadata = {
  title: "The Builds — Curiosity Inc",
  description: "Three content systems. One complete infrastructure.",
};

export default function Builds() {
  return <BuildsPage />;
}
