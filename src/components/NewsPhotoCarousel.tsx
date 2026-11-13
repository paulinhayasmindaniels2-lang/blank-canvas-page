import { memo, useCallback, useEffect, useState } from "react";
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
  photoId: number;
  category: string;
  title: string;
  author: string;
  date: string;
  image?: string;
  summary?: string;
}

const slides: NewsSlide[] = [
  {
    photoId: -1,
    category: "Entretenimento",
    title: "Imagem de Jon Vlogs em academia de Londrina desperta curiosidade dos fãs",
    author: "Redação Ember.News",
    date: "Imagem recebida pela redação",
    image: "/ultrax-attached-9f64c2e2-07e2-4744-871f-e50d42bed9d9.svg",
    summary:
      "O registro enviado à redação circula com a alegação de que Jon Vlogs esteve em uma academia em Londrina. A autenticidade e o contexto da imagem não foram verificados, e ela não confirma encontro ou qualquer vínculo entre as pessoas retratadas.",
  },
  {
    photoId: 1015,
    category: "Economia",
    title: "Bancos centrais sinalizam nova rodada de ajustes nos juros globais",
    author: "Marina Costa",
    date: "12 de março de 2024",
  },
  {
    photoId: 1016,
    category: "Meio Ambiente",
    title: "Estiagem prolongada acende alerta sobre reservatórios do Sudeste",
    author: "Rafael Nogueira",
    date: "11 de março de 2024",
  },
  {
    photoId: 1018,
    category: "Política",
    title: "Congresso retoma pauta de reformas em meio a impasses partidários",
    author: "Camila Duarte",
    date: "10 de março de 2024",
  },
  {
    photoId: 1024,
    category: "Internacional",
    title: "Cúpula em Genebra discute novo pacto climático entre nações",
    author: "Bruno Salgado",
    date: "9 de março de 2024",
  },
  {
    photoId: 1035,
    category: "Ciência",
    title: "Pesquisadores brasileiros identificam nova espécie na Amazônia",
    author: "Teresa Lima",
    date: "8 de março de 2024",
  },
  {
    photoId: 1039,
    category: "Esportes",
    title: "Seleção se prepara para amistosos decisivos antes do torneio",
    author: "Diego Farias",
    date: "7 de março de 2024",
  },
  {
    photoId: 1043,
    category: "Cultura",
    title: "Mostra internacional de cinema chega à capital com produções inéditas",
    author: "Helena Prado",
    date: "6 de março de 2024",
  },
  {
    photoId: 1050,
    category: "Tecnologia",
    title: "Setor de semicondutores anuncia investimentos bilionários no país",
    author: "Otávio Ramos",
    date: "5 de março de 2024",
  },
];

const SLIDE_WIDTHS = [640, 1024, 1600];
const SLIDE_SIZES = "(min-width: 1152px) 1152px, 100vw";

function photoUrl(id: number, width: number) {
  return `https://picsum.photos/id/${id}/${width}/${Math.round((width * 9) / 16)}`;
}

function photoSrcSet(id: number) {
  return SLIDE_WIDTHS.map((w) => `${photoUrl(id, w)} ${w}w`).join(", ");
}

// Objeto estável: evita recriar as opções do Embla a cada render.
const CAROUSEL_OPTS = { loop: true };

const NewsSlideItem = memo(function NewsSlideItem({ slide }: { slide: NewsSlide }) {
  return (
    <CarouselItem>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[6px] border border-border sm:aspect-[21/9]">
        <img
          src={slide.image ?? photoUrl(slide.photoId, 1024)}
          srcSet={slide.image ? undefined : photoSrcSet(slide.photoId)}
          sizes={SLIDE_SIZES}
          width={1600}
          height={900}
          alt={slide.title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-black/45 p-4 backdrop-blur-[2px] sm:p-6 md:p-8">
          <span className="kicker text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">{slide.category}</span>
          <h3 className="headline-serif text-xl !text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.9)] sm:text-2xl md:text-3xl">
            {slide.title}
          </h3>
          {slide.summary && (
            <p className="max-w-3xl text-sm leading-relaxed text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
              {slide.summary}
            </p>
          )}
          <p className="text-sm text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
            {slide.author} · {slide.date}
          </p>
        </div>
      </div>
    </CarouselItem>
  );
});

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
      <Carousel setApi={setApi} className="w-full" opts={CAROUSEL_OPTS}>
        <CarouselContent>
          {slides.map((slide) => (
            <NewsSlideItem key={slide.photoId} slide={slide} />
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
        {slides.map((slide, index) => (
          <button
            key={slide.photoId}
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
