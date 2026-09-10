import { Hero } from "@/components/sections/home/hero";
import { ClientsMarquee } from "@/components/sections/home/clients-marquee";
import { FeaturedWork } from "@/components/sections/home/featured-work";
import { Manifesto } from "@/components/sections/home/manifesto";
import { Services } from "@/components/sections/home/services";
import { Testimonial } from "@/components/sections/home/testimonial";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ClientsMarquee />
      <FeaturedWork />
      <Manifesto />
      <Services />
      <Testimonial />
    </main>
  );
}
