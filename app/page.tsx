import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { TheBuilds } from "@/components/sections/TheBuilds";
import { Proof } from "@/components/sections/Proof";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <TheBuilds />
      <Proof />
      <FinalCTA />
    </main>
  );
}
