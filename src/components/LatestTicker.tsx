import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/articles";

export function LatestTicker({ items }: { items: Article[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id != null) return;
      id = setInterval(() => setActive((i) => (i + 1) % items.length), 3500);
    };
    const stop = () => {
      if (id != null) {
        clearInterval(id);
        id = null;
      }
    };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <aside className="flex flex-col gap-4 lg:border-l lg:border-border lg:pl-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Últimas
        </h2>
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-ember" />
          </span>
          ao vivo
        </span>
      </div>

      <ol className="flex flex-col divide-y divide-border">
        {items.map((a, i) => (
          <motion.li
            key={a.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
            className="relative py-3 first:pt-0"
          >
            <AnimatePresence>
              {active === i && (
                <motion.span
                  layoutId="latest-active"
                  className="pointer-events-none absolute inset-x-0 inset-y-1 -z-10 rounded-md bg-ember/5"
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                />
              )}
            </AnimatePresence>
            <Link
              to="/artigo/$slug"
              params={{ slug: a.slug }}
              className="group flex gap-3"
            >
              <motion.span
                animate={{
                  color:
                    active === i
                      ? "var(--ember, oklch(0.45 0.25 25))"
                      : "color-mix(in oklab, var(--ember, oklch(0.45 0.25 25)) 70%, transparent)",
                  scale: active === i ? 1.08 : 1,
                }}
                transition={{ duration: 0.35 }}
                className="font-display text-2xl tabular-nums"
              >
                {(i + 1).toString().padStart(2, "0")}
              </motion.span>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {a.category}
                </span>
                <h3 className="text-sm font-medium leading-snug transition-colors group-hover:text-ember">
                  {a.title}
                </h3>
              </div>
            </Link>
          </motion.li>
        ))}
      </ol>
    </aside>
  );
}
