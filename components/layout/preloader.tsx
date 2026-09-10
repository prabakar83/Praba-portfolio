"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useAppStore } from "@/lib/store";
import { siteConfig } from "@/content/site.config";

const MIN_DURATION = 1.6; // seconds — the loader never flashes away instantly

/**
 * Cinematic preloader: percentage counter + hairline progress bar,
 * then a curtain reveal once fonts/critical assets are ready.
 * Sets `loaderDone` in the global store so the hero can start in sync.
 * Rendered in SSR HTML so it covers the page from the very first paint;
 * dismissed instantly (no motion) when reduced motion is preferred.
 */
export function Preloader() {
  const setLoaderDone = useAppStore((s) => s.setLoaderDone);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rootRef.current) return;

    const dismiss = () => {
      document.documentElement.style.overflow = "";
      setLoaderDone(true);
      setHidden(true);
    };

    // Reduced motion → no show. Hidden tab (opened in background) →
    // rAF is frozen, so skip the show and have the site ready instead.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.visibilityState === "hidden"
    ) {
      window.setTimeout(dismiss, 0);
      return;
    }

    // Freeze native scroll while the curtain is down
    document.documentElement.style.overflow = "hidden";

    const progress = { value: 0 };
    let assetsReady = false;
    let counterDone = false;

    const render = () => {
      if (counterRef.current) {
        counterRef.current.textContent = String(
          Math.round(progress.value),
        ).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress.value / 100})`;
      }
    };

    const finish = () => {
      if (!assetsReady || !counterDone) return;
      const tl = gsap.timeline({ onComplete: dismiss });
      tl.to(progress, {
        value: 100,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: render,
      })
        .to(contentRef.current, {
          yPercent: -30,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.in",
        })
        .to(rootRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: EASE.cinematic,
        });
    };

    // Counter crawls to 99 while we wait for real readiness
    gsap.to(progress, {
      value: 99,
      duration: MIN_DURATION,
      ease: "power2.inOut",
      onUpdate: render,
      onComplete: () => {
        counterDone = true;
        finish();
      },
    });

    document.fonts.ready.then(() => {
      assetsReady = true;
      finish();
    });
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[150] flex flex-col justify-between bg-background"
      aria-hidden="true"
    >
      <div className="h-px w-full origin-left bg-border">
        <div
          ref={barRef}
          className="h-px w-full origin-left scale-x-0 bg-accent"
        />
      </div>
      <div
        ref={contentRef}
        className="container-x flex flex-1 flex-col items-center justify-center gap-6"
      >
        <span className="font-display text-2xl italic tracking-wide">
          {siteConfig.name}
        </span>
        <p className="text-label">{siteConfig.tagline}</p>
      </div>
      <div className="container-x flex items-end justify-between pb-10">
        <span className="text-label">Loading experience</span>
        <span
          ref={counterRef}
          className="font-display text-6xl tabular-nums leading-none"
        >
          000
        </span>
      </div>
    </div>
  );
}
