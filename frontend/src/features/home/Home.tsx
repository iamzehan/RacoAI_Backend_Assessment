import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Package, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { Feature } from "./Feature";

export function Home() {
  const hero = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.from("[data-hero]", {
          opacity: 0,
          y: 22,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out"
        });
    },
    { scope: hero }
  );

  return (
    <div ref={hero}>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <div
            data-hero
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-sm font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
          >
            <Sparkles size={15} /> Curated essentials, simply delivered
          </div>
          <h1
            data-hero
            className="max-w-xl text-5xl font-black leading-[.98] tracking-tight sm:text-7xl"
          >
            Thoughtful things for your everyday.
          </h1>
          <p
            data-hero
            className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-400"
          >
            A calmer way to discover useful, well-made products—backed by a
            secure, seamless shopping experience.
          </p>
          <div data-hero className="mt-8 flex gap-3">
            <Link className="button-primary" to="/shop">
              Explore collection <ArrowRight size={17} />
            </Link>
            <Link className="button-secondary" to="/login">
              Your orders
            </Link>
          </div>
        </div>
        <div
          data-hero
          className="panel relative min-h-80 overflow-hidden bg-gradient-to-br from-violet-700 via-brand to-indigo-950 p-8 text-white"
        >
          <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10" />
          <div className="relative flex h-full flex-col justify-end">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-violet-200">
              The daily edit
            </p>
            <h2 className="mt-3 max-w-sm text-4xl font-bold">
              Designed around the way you live.
            </h2>
            <div className="mt-8 flex gap-3 text-sm text-violet-100">
              <span className="rounded-lg bg-white/10 px-3 py-2">
                Secure checkout
              </span>
              <span className="rounded-lg bg-white/10 px-3 py-2">
                Live inventory
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <Feature
            icon={<Package />}
            title="Considered selection"
            text="Find your next favourite without the noise."
          />
          <Feature
            icon={<ShieldCheck />}
            title="Secure by default"
            text="Account and order data stay protected."
          />
          <Feature
            icon={<ShoppingBag />}
            title="Simple ordering"
            text="A clear path from discovery to delivery."
          />
        </div>
      </section>
    </div>
  );
}
