import { createFileRoute } from "@tanstack/react-router";
import logoUrl from "../assets/logo.png";
import imageUrl from "../assets/image.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background">
      <img
        src={logoUrl}
        alt="Logo"
        className="max-w-[300px] w-full h-auto"
      />
      <img
        src={imageUrl}
        alt="Imagem"
        className="max-w-[300px] w-full h-auto rounded-lg"
      />
    </div>
  );
}
