import { siteConfig } from "@/content/site.config";
import { Marquee } from "@/components/motion/marquee";

/** Infinite strip of (fictional) client names. */
export function ClientsMarquee() {
  return (
    <section
      className="border-y border-border py-10"
      aria-label="Selected clients"
    >
      <Marquee duration={36}>
        {siteConfig.clients.map((client) => (
          <span
            key={client}
            className="flex items-center gap-[4vw] whitespace-nowrap font-display text-3xl text-muted-foreground/70"
          >
            {client}
            <span className="text-accent" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
