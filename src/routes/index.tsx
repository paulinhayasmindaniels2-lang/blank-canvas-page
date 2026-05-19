import { createFileRoute } from "@tanstack/react-router";
import logoUrl from "../assets/logo.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#fcfbf8" }}
    >
      <img
        src={logoUrl}
        alt="Logo"
        className="max-w-[300px] w-full h-auto"
      />
    </div>
  );
}
