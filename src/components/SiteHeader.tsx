import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { categories } from "@/lib/articles";

export function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate({ to: "/buscar", search: { q } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="ember-logo group flex items-center gap-2">
          <span className="ember-dot inline-block size-2.5 rounded-full bg-ember" />
          <span className="ember-word bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#EC4899] bg-clip-text font-display text-lg uppercase tracking-wider text-transparent">
            Ember<span className="ember-accent">.</span>News
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {categories.map((c) => (
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
              <span className="absolute inset-x-5 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-fuchsia-500 to-violet-500 opacity-0 transition-all duration-300 group-hover:w-[calc(100%-40px)] group-hover:opacity-100 group-[.active]:inset-x-4 group-[.active]:w-auto group-[.active]:opacity-100 group-[.active]:shadow-[0_0_12px_rgba(217,70,239,0.6)]" />
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden md:block">
          <div className="ember-search relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artigos..."
              className="w-56 rounded-[7px] border border-[#EC4899] bg-card py-2 pl-9 pr-3 text-sm shadow-[0_0_12px_rgba(236,72,153,0.55)] placeholder:text-muted-foreground transition-shadow focus:border-[#F472B6] focus:shadow-[0_0_18px_rgba(236,72,153,0.8)] focus:outline-none"
            />
          </div>
        </form>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto rounded-md p-2 text-foreground md:hidden"
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
                  className="w-full rounded-[7px] border border-[#EC4899] bg-card py-2 pl-9 pr-3 text-sm shadow-[0_0_12px_rgba(236,72,153,0.55)] placeholder:text-muted-foreground transition-shadow focus:border-[#F472B6] focus:shadow-[0_0_18px_rgba(236,72,153,0.8)] focus:outline-none"
                />
              </div>
            </form>
            <div className="grid grid-cols-1 gap-1">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="group relative px-3 py-2"
                  activeProps={{ className: "active" }}
                >
                  <span className="relative z-10 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors duration-300 group-hover:text-foreground group-[.active]:font-semibold group-[.active]:text-foreground">
                    {c.name}
                  </span>
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 w-0 bg-gradient-to-r from-fuchsia-500 to-violet-500 opacity-0 transition-all duration-300 group-hover:w-[calc(100%-24px)] group-hover:opacity-100 group-[.active]:inset-x-3 group-[.active]:w-auto group-[.active]:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
