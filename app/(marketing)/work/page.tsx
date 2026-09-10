import type { Metadata } from "next";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { WorkGrid } from "@/components/sections/work-grid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects — cinematic websites, real-time 3D and brand experiences.",
};

export default function WorkPage() {
  return (
    <main className="container-x pt-40 pb-28">
      <Reveal>
        <p className="text-label mb-8">Selected work</p>
      </Reveal>
      <SplitTextReveal as="h1" type="words" className="text-display-xl mb-20">
        Every pixel earns its place
      </SplitTextReveal>
      <WorkGrid />
    </main>
  );
}
