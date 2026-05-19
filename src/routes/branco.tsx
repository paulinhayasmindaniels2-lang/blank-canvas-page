import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/branco")({
  head: () => ({
    meta: [
      { title: "Página em branco" },
      { name: "description", content: "Página em branco." },
    ],
  }),
  component: BrancoPage,
});

function BrancoPage() {
  return <div className="min-h-screen bg-white" />;
}
