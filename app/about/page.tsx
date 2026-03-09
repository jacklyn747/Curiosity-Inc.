import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About — Curiosity Inc",
  description: "Intellectual glamour. Invisible infrastructure.",
};

export default function About() {
  return <AboutPage />;
}
