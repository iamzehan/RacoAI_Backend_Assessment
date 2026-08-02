import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Package, ShoppingBag, Sparkles, Truck } from "lucide-react";

type AppLoaderProps = {
  onComplete: () => void;
};

export function AppLoader({ onComplete }: AppLoaderProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete
      });

      if (reduced) {
        tl.to(root.current, { opacity: 0, duration: 0.35, delay: 0.4 });
        return;
      }

      gsap.set("[data-loader-orb]", { scale: 0.6, opacity: 0 });
      gsap.set("[data-loader-icon]", { y: 28, opacity: 0, rotate: -12 });
      gsap.set("[data-loader-bag]", { y: 40, opacity: 0, scale: 0.8 });
      gsap.set("[data-loader-title]", { y: 18, opacity: 0 });
      gsap.set("[data-loader-bar]", { scaleX: 0, transformOrigin: "left center" });
      gsap.set("[data-loader-tag]", { opacity: 0, y: 10 });

      tl.to("[data-loader-orb]", {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08
      })
        .to(
          "[data-loader-bag]",
          { y: 0, opacity: 1, scale: 1, duration: 0.65 },
          "-=0.35"
        )
        .to(
          "[data-loader-icon]",
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.55,
            stagger: 0.1
          },
          "-=0.4"
        )
        .to(
          "[data-loader-title]",
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.25"
        )
        .to("[data-loader-bar]", { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, "-=0.2")
        .to("[data-loader-tag]", { opacity: 1, y: 0, duration: 0.35 }, "-=0.45")
        .to(
          "[data-loader-icon]",
          {
            y: -6,
            duration: 0.45,
            yoyo: true,
            repeat: 1,
            stagger: 0.08,
            ease: "sine.inOut"
          },
          "-=0.6"
        )
        .to(root.current, {
          opacity: 0,
          y: -18,
          duration: 0.55,
          ease: "power2.in"
        });
    },
    { scope: root }
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[var(--color-mist)]"
      role="status"
      aria-live="polite"
      aria-label="Loading storefront"
    >
      <div
        data-loader-orb
        className="pointer-events-none absolute -left-16 top-16 size-56 rounded-full bg-brand/15 blur-2xl"
      />
      <div
        data-loader-orb
        className="pointer-events-none absolute -right-10 bottom-10 size-72 rounded-full bg-violet-400/20 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-6 text-center">
        <div
          data-loader-bag
          className="relative mb-8 grid size-24 place-items-center rounded-[1.75rem] bg-brand text-white shadow-2xl shadow-brand/30"
        >
          <ShoppingBag size={36} />
          <span className="absolute -right-2 -top-2 grid size-8 place-items-center rounded-full bg-white text-brand shadow">
            <Sparkles size={14} />
          </span>
        </div>

        <div className="mb-8 flex items-center gap-4 text-brand">
          <span
            data-loader-icon
            className="grid size-12 place-items-center rounded-2xl bg-[var(--surface)] shadow"
          >
            <Package size={20} />
          </span>
          <span
            data-loader-icon
            className="grid size-12 place-items-center rounded-2xl bg-[var(--surface)] shadow"
          >
            <ShoppingBag size={20} />
          </span>
          <span
            data-loader-icon
            className="grid size-12 place-items-center rounded-2xl bg-[var(--surface)] shadow"
          >
            <Truck size={20} />
          </span>
        </div>

        <p
          data-loader-title
          className="text-3xl font-black tracking-tight text-[var(--color-ink)]"
        >
          Preparing your store
        </p>
        <p
          data-loader-tag
          className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          Curating products, cart, and checkout…
        </p>

        <div className="mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            data-loader-bar
            className="h-full w-full rounded-full bg-brand"
          />
        </div>
      </div>
    </div>
  );
}
