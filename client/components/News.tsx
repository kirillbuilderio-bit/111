import { useState, useEffect } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string;
  author?: string;
  published?: boolean;
}

// Fallback news if API fails
const fallbackNewsItems: NewsItem[] = [
  {
    id: 1,
    title: "Новости загружаются...",
    content: "Пожалуйста, подождите, пока мы загружаем последние новости.",
    date: new Date().toISOString(),
    author: "System",
    published: true,
  },
];

function getCategoryColor(category: string) {
  switch (category) {
    case "События":
      return "text-green-400";
    case "Акции":
      return "text-gaming-accent";
    case "Турниры":
      return "text-purple-400";
    case "Обновления":
      return "text-blue-400";
    default:
      return "text-gaming-text-muted";
  }
}

// Helper function to get category from content
function getCategory(content: string): string {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("турнир") || lowerContent.includes("соревнование"))
    return "Турниры";
  if (lowerContent.includes("обновление") || lowerContent.includes("update"))
    return "Обновления";
  if (lowerContent.includes("акция") || lowerContent.includes("скидка"))
    return "Акции";
  if (lowerContent.includes("событие") || lowerContent.includes("поздрав"))
    return "События";
  return "Новости";
}

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNewsItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log("Fetching news from API...");
        const response = await fetch("/api/news");
        if (response.ok) {
          const apiNews = await response.json();
          console.log("Received news data:", apiNews);

          // Filter only published news and limit to 6 items
          const publishedNews = apiNews
            .filter((news: NewsItem) => news.published !== false)
            .slice(0, 6);

          console.log("Filtered published news:", publishedNews);

          if (publishedNews.length > 0) {
            setNewsItems(publishedNews);
            console.log("Set news items to:", publishedNews);
          } else {
            console.log("No published news found, using fallback");
            setNewsItems(fallbackNewsItems);
          }
        } else {
          console.error("Failed to fetch news:", response.status);
          setNewsItems(fallbackNewsItems);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsItems(fallbackNewsItems);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-12 bg-gaming-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gaming-text">
            Новости
          </h2>
          <Link to="/news">
            <Button
              variant="outline"
              className="border-gaming-border text-gaming-text hover:bg-gaming-card hover:text-gaming-accent"
            >
              Все новости
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gaming-card border border-gaming-border rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gaming-bg"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gaming-bg rounded w-3/4"></div>
                    <div className="h-4 bg-gaming-bg rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gaming-bg rounded"></div>
                      <div className="h-3 bg-gaming-bg rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            : newsItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-gaming-card border border-gaming-border rounded-lg overflow-hidden hover:bg-gaming-card-hover transition-colors group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image || "/api/placeholder/400/250"}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-md bg-black/50 ${getCategoryColor(getCategory(item.content))}`}
                      >
                        {getCategory(item.content)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-gaming-text-muted text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(item.date).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    <h3 className="font-bold text-gaming-text mb-3 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                      <Link to={`/news/${item.id}`}>{item.title}</Link>
                    </h3>

                    <p className="text-gaming-text-muted text-sm line-clamp-3 mb-4">
                      {item.content.substring(0, 150)}
                      {item.content.length > 150 ? "..." : ""}
                    </p>

                    <Link
                      to={`/news/${item.id}`}
                      className="inline-flex items-center text-gaming-accent hover:text-gaming-accent-hover font-medium text-sm transition-colors"
                    >
                      Читать далее
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
            <h3 className="text-xl font-bold text-gaming-text mb-4">
              Не пропускайте важные новости!
            </h3>
            <p className="text-gaming-text-muted mb-6">
              Подпишитесь на наши уведомления, чтобы первыми узнавать о новых
              обновлениях, турнирах и событиях в сообществе RSGS.
            </p>
            <Button
              className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold"
              onClick={() =>
                toast({
                  title: "В разработке",
                  description:
                    "Функция подписки на новости скоро будет доступна",
                  duration: 3000,
                })
              }
            >
              Подписаться на новости
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
