import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Search, Menu, X, Sun, Moon, User as UserIcon, ChevronDown, LogOut } from "lucide-react";
import { categories } from "@/lib/articles";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export function SiteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored === "dark";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    toast.success("Você saiu da sua conta.");
    navigate({ to: "/" });
  };

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate({ to: "/buscar", search: { q } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <motion.div
        style={{ scaleX }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-ember via-white to-ember"
      />
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-4 md:px-6 lg:px-8">
        <Link to="/" className="ember-logo group flex items-center gap-2">
          <span className="ember-dot inline-block size-2.5 rounded-full bg-ember" />
          <span className="ember-word bg-gradient-to-r from-ember via-primary to-ember bg-clip-text font-display text-base uppercase tracking-wider text-transparent">
            Ember<span className="ember-accent">.</span>News
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {categories.map((c) => {
            const isActive = location.pathname === `/categoria/${c.slug}`;
            return (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                className="group relative px-5 py-2"
                activeProps={{ className: "active" }}
              >
                <span className="relative z-10 whitespace-nowrap text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors duration-300 group-hover:text-foreground group-[.active]:font-semibold group-[.active]:text-foreground">
                  {c.name}
                </span>
                {isActive ? (
                  <motion.span
                    layoutId="nav-tab-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-x-4 -bottom-1 h-0.5 w-auto bg-gradient-to-r from-nav-glow-start to-nav-glow-end shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  />
                ) : (
                  <span className="absolute inset-x-5 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-nav-glow-start to-nav-glow-end opacity-0 transition-all duration-300 group-hover:w-[calc(100%-40px)] group-hover:opacity-100" />
                )}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden md:block">
          <div className="ember-search relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artigos..."
              className="w-48 rounded-[7px] border border-neutral-700 bg-card py-1.5 pl-9 pr-3 text-sm shadow-[0_0_12px_rgba(255,255,255,0.15)] placeholder:text-muted-foreground transition-shadow focus:border-neutral-500 focus:shadow-[0_0_18px_rgba(255,255,255,0.25)] focus:outline-none"
            />
          </div>
        </form>

        {user ? (
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="size-6 rounded-full object-cover" />
              ) : (
                <span className="flex size-6 items-center justify-center rounded-full bg-ember/15 text-ember">
                  <UserIcon className="size-3.5" />
                </span>
              )}
              <span className="max-w-[110px] truncate">{displayName}</span>
              <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="size-9 rounded-full object-cover" />
                  ) : (
                    <span className="flex size-9 items-center justify-center rounded-full bg-ember/15 text-ember">
                      <UserIcon className="size-4" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <LogOut className="size-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-md border border-border/60 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 md:flex"
          >
            Entrar
          </Link>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md border border-border/60 p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          title={isDark ? "Modo claro" : "Modo escuro"}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-foreground md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-4">
            <form onSubmit={handleSearch}>
              <div className="ember-search relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar artigos..."
                  className="w-full rounded-[7px] border border-neutral-700 bg-card py-2 pl-9 pr-3 text-sm shadow-[0_0_12px_rgba(255,255,255,0.15)] placeholder:text-muted-foreground transition-shadow focus:border-neutral-500 focus:shadow-[0_0_18px_rgba(255,255,255,0.25)] focus:outline-none"
                />
              </div>
            </form>
            <div className="grid grid-cols-1 gap-1">
              {categories.map((c) => {
                const isActive = location.pathname === `/categoria/${c.slug}`;
                return (
                  <Link
                    key={c.slug}
                    to="/categoria/$slug"
                    params={{ slug: c.slug }}
                    onClick={() => setOpen(false)}
                    className="group relative px-3 py-2"
                    activeProps={{ className: "active" }}
                  >
                    <span
                      className={`relative z-10 block text-sm font-medium uppercase tracking-wider text-muted-foreground transition-all duration-300 group-hover:text-foreground group-[.active]:font-semibold group-[.active]:text-foreground ${
                        isActive ? "translate-x-1.5" : ""
                      }`}
                    >
                      {c.name}
                    </span>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-tab-indicator-mobile"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-y-1 left-0 w-1 rounded-full bg-gradient-to-b from-nav-glow-start to-nav-glow-end"
                      />
                    ) : (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 w-0 bg-gradient-to-r from-nav-glow-start to-nav-glow-end opacity-0 transition-all duration-300 group-hover:w-[calc(100%-24px)] group-hover:opacity-100" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-border/60 pt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="size-9 rounded-full object-cover" />
                    ) : (
                      <span className="flex size-9 items-center justify-center rounded-full bg-ember/15 text-ember">
                        <UserIcon className="size-4" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <LogOut className="size-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
