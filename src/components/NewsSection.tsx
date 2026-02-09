import { useState, useEffect, useCallback } from "react";
import { newsItems } from "@/data/news";
import { getNewsList, type NewsItem } from "@/lib/newsStorage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Newspaper, Calendar } from "lucide-react";

const STATIC_NEWS = newsItems;

const NewsCard = ({
  item,
  className = "",
}: {
  item: { id: string; title: string; summary: string; date: string };
  className?: string;
}) => (
  <Card
    className={`h-full rounded-xl border-2 border-primary/60 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:border-primary ${className}`}
  >
    <CardHeader className="pb-2">
      <h3 className="font-display text-xl font-bold line-clamp-2 text-foreground tracking-tight">
        {item.title}
      </h3>
      <div className="flex items-center gap-1.5 text-sm font-sans font-medium text-primary">
        <Calendar className="h-4 w-4 shrink-0" />
        {new Date(item.date).toLocaleDateString("uz-UZ", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-[15px] font-sans font-normal text-foreground/90 leading-relaxed line-clamp-3">
        {item.summary}
      </p>
    </CardContent>
  </Card>
);

export const NewsSection = () => {
  const [apiNews, setApiNews] = useState<NewsItem[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const loadNews = useCallback(async () => {
    try {
      const list = await getNewsList();
      setApiNews(list);
    } catch {
      setApiNews([]);
    }
  }, []);

  useEffect(() => {
    loadNews();
    const handleNewsUpdated = () => void loadNews();
    const onVisibilityChange = () =>
      document.visibilityState === "visible" && loadNews();
    window.addEventListener("newsUpdated", handleNewsUpdated);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("newsUpdated", handleNewsUpdated);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loadNews]);

  // Carousel avtomatik aylanishi
  useEffect(() => {
    if (!carouselApi || apiNews.length <= 1) return;
    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [carouselApi, apiNews.length]);

  const hasApiNews = apiNews.length > 0;

  return (
    <section id="yangiliklar" className="scroll-mt-20 container mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10">
          <Newspaper className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Yangiliklar
          </h2>
          <p className="text-sm font-sans text-foreground/80">
            Platforma yangilanishlari va xabarlar
          </p>
        </div>
      </div>

      {/* Statik yangiliklar — grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {STATIC_NEWS.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* API dan qo'shilgan yangiliklar — carousel */}
      {hasApiNews && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-semibold mb-4 text-foreground/90">
            So'nggi yangiliklar
          </h3>
          <Carousel
            setApi={setCarouselApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {apiNews.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <NewsCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>
      )}
    </section>
  );
};
