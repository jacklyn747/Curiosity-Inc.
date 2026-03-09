import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Book a Build Call — Curiosity Inc",
  description: "Tell us what you're working on.",
};

export default function Contact() {
  return <ContactPage />;
}
