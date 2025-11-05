import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  published: boolean;
  category?: string;
  image?: string;
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (slug: string) => {
    try {
      setLoading(true);
      
      // Try to get article by slug or ID
      const response = await fetch(`/api/news/${slug}`);
      
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else if (response.status === 404) {
        // If not found by slug, try to get all news and find by slug
        const allNewsResponse = await fetch('/api/news');
        if (allNewsResponse.ok) {
          const allNews = await allNewsResponse.json();
          const foundArticle = allNews.find((news: NewsArticle) => 
            generateSlug(news.title) === slug || news.id.toString() === slug
          );
          
          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            setError("Новость не найдена");
          }
        } else {
          setError("Ошибка загрузки новости");
        }
      } else {
        setError("Ошибка загрузки новости");
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError("Ошибка загрузки новости");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-я]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim()) {
        return (
          <p key={index} className="text-gaming-text mb-4 leading-relaxed">
            {paragraph}
          </p>
        );
      }
      return <br key={index} />;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "События":
        return "text-green-400 bg-green-400/20";
      case "Акции":
        return "text-gaming-accent bg-gaming-accent/20";
      case "Турниры":
        return "text-purple-400 bg-purple-400/20";
      case "Обновления":
        return "text-blue-400 bg-blue-400/20";
      default:
        return "text-gaming-text-muted bg-gaming-border/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gaming-text">Загрузка новости...</div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gaming-text mb-4">
              Новость не найдена
            </h1>
            <p className="text-gaming-text-muted mb-8">
              {error || "Запрашиваемая новость не существует или была удалена."}
            </p>
            <Link to="/news">
              <Button className="bg-gaming-accent hover:bg-gaming-accent-hover text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к новостям
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/news">
              <Button 
                variant="outline" 
                className="border-gaming-border text-gaming-text hover:bg-gaming-card"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к новос��ям
              </Button>
            </Link>
          </div>

          {/* Article */}
          <article className="bg-gaming-card border border-gaming-border rounded-lg overflow-hidden">
            {/* Article Image */}
            {article.image && (
              <div className="w-full h-64 md:h-80 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {article.category && (
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.category)}`}>
                    <Tag className="w-3 h-3 mr-1 inline" />
                    {article.category}
                  </span>
                )}
                
                <div className="flex items-center text-gaming-text-muted text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(article.date).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                <div className="flex items-center text-gaming-text-muted text-sm">
                  <User className="w-4 h-4 mr-2" />
                  {article.author}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gaming-text mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Content */}
              <div className="prose prose-lg prose-invert max-w-none">
                {formatContent(article.content)}
              </div>
            </div>
          </article>

          {/* Related News Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gaming-text mb-6">
              Другие новости
            </h2>
            <div className="text-center">
              <Link to="/news">
                <Button className="bg-gaming-accent hover:bg-gaming-accent-hover text-black">
                  Посмотреть все новости
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
