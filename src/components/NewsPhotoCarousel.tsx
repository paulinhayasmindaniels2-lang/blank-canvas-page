import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface NewsSlide {
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
}

const slides: NewsSlide[] = [
  {
    image: "https://picsum.photos/id/1015/1600/900",
    category: "Economia",
    title: "Bancos centrais sinalizam nova rodada de ajustes nos juros globais",
    author: "Marina Costa",
    date: "12 de março de 2024",
  },
  {
    image: "https://picsum.photos/id/1016/1600/900",
    category: "Meio Ambiente",
    title: "Estiagem prolongada acende alerta sobre reservatórios do Sudeste",
    author: "Rafael Nogueira",
    date: "11 de março de 2024",
  },
  {
    image: "https://picsum.photos/id/1018/1600/900",
    category: "Política",
    title: "Congresso retoma pauta de reformas em meio a impasses partidários",
    author: "Camila Duarte",
    date: "10 de março de 2024",
  },
  {
    image: "https://picsum.photos/id/1024/1600/900",
    category: "Internacional",
    title: "Cúpula em Genebra discute novo pacto climático entre nações",
    author: "Bruno Salgado",
    date: "9 de março de 2024",
  },
  {
    image: "https://picsum.photos/id/1035/1600/900",
    category: "Ciência",
    title: "Pesquisadores brasileiros identificam nova espécie na Amazônia",
    author: "Teresa Lima",
    date: "8 de março de 2024",
  },
  {
    image: "https://picsum.photos/id/1039/1600/900",
    category: "Esportes",
    title: "Seleção se prepara para amistosos decisivos antes do torneio",
    author: "Diego Farias",
    date: "7 de março de 2024",
  },
  {
    image: "https://picsum.photos/id/1043/1600/900",
    category: "Cultura",
    title: "Mostra internacional de cinema chega à capital com produções inéditas",
    author: "Helena Prado",
    date: "6 de março de 2024",
  },
  {
    image: "https://picsum.photos/id/1050/1600/900",
    category: "Tecnologia",
    title: "Setor de semicondutores anuncia investimentos bilionários no país",
    author: "Otávio Ramos",
    date: "5 de março de 2024",
  },
];

const NewsPhotoCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="relative">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[6px] border border-border sm:aspect-[21/9]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-black/45 p-4 backdrop-blur-[2px] sm:p-6 md:p-8">
                  <span className="kicker text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">{slide.category}</span>
                  <h3 className="headline-serif text-xl text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.9)] sm:text-2xl md:text-3xl">
                    {slide.title}
                  </h3>
                  <p className="text-sm text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                    {slide.author} · {slide.date}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 h-10 w-10 rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground sm:left-4 [&>svg]:hidden">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </CarouselPrevious>
        <CarouselNext className="right-2 h-10 w-10 rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground sm:right-4 [&>svg]:hidden">
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </CarouselNext>
      </Carousel>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Ir para o slide ${index + 1}`}
            aria-current={selectedIndex === index}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors",
              selectedIndex === index ? "bg-primary" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsPhotoCarousel;
