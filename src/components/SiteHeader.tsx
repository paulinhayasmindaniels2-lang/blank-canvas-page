import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Em Pauta", href: "#em-pauta" },
  { label: "Categorias", href: "#categorias" },
  { label: "Assinaturas", href: "#planos" },
  { label: "Depoimentos", href: "#depoimentos" },
] as const;

function getTodayLong() {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function useTheme() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = React.useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
    setIsDark(next);
  }, []);

  return { isDark, toggle };
}

export function SiteHeader() {
  const [today, setToday] = React.useState("");
  const { isDark, toggle } = useTheme();

  React.useEffect(() => {
    setToday(getTodayLong());
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      {/* Utility line */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground sm:px-6">
        <span suppressHydrationWarning>{today}</span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Edição digital</span>
          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-border text-foreground transition-colors hover:bg-secondary"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="newspaper-rule" />

      {/* Masthead */}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-5 sm:px-6">
        <Link
          to="/"
          className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl"
        >
          Ember<span className="text-primary">.</span>News
        </Link>
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground">
          Jornal digital de tecnologia, negócios e cultura
        </p>
      </div>

      <div className="newspaper-rule" />

      {/* Navigation */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <nav className="hidden md:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-primary",
                index !== 0 && "border-l border-border"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#planos"
          className="btn-news-lilac hidden rounded-[6px] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] md:inline-flex"
        >
          Assinar agora
        </a>

        {/* Mobile menu */}
        <div className="flex w-full items-center justify-between py-2 md:hidden">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Menu
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menu"
                className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-border text-foreground transition-colors hover:bg-secondary"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l border-border bg-background">
              <div className="mt-8 flex flex-col">
                <span className="font-display text-xl font-black text-foreground">
                  Ember<span className="text-primary">.</span>News
                </span>
                <div className="mt-6 flex flex-col">
                  {NAV_LINKS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <a
                        href={item.href}
                        className="border-b border-border py-3 text-sm font-semibold uppercase tracking-[0.1em] text-foreground transition-colors hover:text-primary"
                      >
                        {item.label}
                      </a>
                    </SheetClose>
                  ))}
                </div>
                <SheetClose asChild>
                  <a
                    href="#planos"
                    className="btn-news-primary mt-6 rounded-[6px] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.12em]"
                  >
                    Assinar agora
                  </a>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
