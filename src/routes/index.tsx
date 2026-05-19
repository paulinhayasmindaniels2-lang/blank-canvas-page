import { createFileRoute } from "@tanstack/react-router";
import logoUrl from "../assets/logo.png";
import imageUrl from "../assets/image.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <img
        src={logoUrl}
        alt="Logo"
        className="max-w-[300px] w-full h-auto"
      />
    </div>
  );
}
