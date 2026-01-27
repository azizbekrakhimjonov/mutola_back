import { NewsItem, newsItems } from "@/data/news";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Newspaper, Calendar } from "lucide-react";

const NewsCard = ({ item }: { item: NewsItem }) => (
  <Card className="h-full transition-shadow hover:shadow-md">
    <CardHeader className="pb-2">
      <h3 className="font-serif text-lg font-semibold line-clamp-2">{item.title}</h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        {new Date(item.date).toLocaleDateString("uz-UZ", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {item.summary}
      </p>
    </CardContent>
  </Card>
);

export const NewsSection = () => {
  return (
    <section id="yangiliklar" className="scroll-mt-20 container mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10">
          <Newspaper className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold">Yangiliklar</h2>
          <p className="text-sm text-muted-foreground">
            Platforma yangilanishlari va xabarlar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
