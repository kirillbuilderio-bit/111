import { useState, useEffect } from "react";
import AdminAuth from "@/components/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  FileText,
  Users,
  Shield,
  Eye,
  Edit,
  Save,
  Plus,
  Trash2,
  Server,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  published: boolean;
}

interface ContentItem {
  id: number;
  title: string;
  content: string;
  lastUpdated: string;
}

export default function AdminPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [rules, setRules] = useState<ContentItem | null>(null);
  const [privacy, setPrivacy] = useState<ContentItem | null>(null);
  const [terms, setTerms] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    author: "Admin",
  });

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_auth");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch all content
      const [newsRes, rulesRes, privacyRes, termsRes] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/rules"),
        fetch("/api/privacy"),
        fetch("/api/terms"),
      ]);

      if (newsRes.ok) setNews(await newsRes.json());
      if (rulesRes.ok) setRules(await rulesRes.json());
      if (privacyRes.ok) setPrivacy(await privacyRes.json());
      if (termsRes.ok) setTerms(await termsRes.json());
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // News management
  const handleCreateNews = async () => {
    if (!newNews.title || !newNews.content) {
      toast({
        title: "Заполните все поля",
        description: "Заголовок и содержимое обязательны",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newNews),
      });

      if (response.ok) {
        const article = await response.json();
        setNews((prev) => [article, ...prev]);
        setNewNews({ title: "", content: "", author: "Admin" });
        toast({
          title: "Новость создана",
          description: "Новость успешно добавлена",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка создания",
        description: "Не удалось создать новость",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNews = async (article: NewsArticle) => {
    try {
      const response = await fetch(`/api/news/${article.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(article),
      });

      if (response.ok) {
        const updated = await response.json();
        setNews((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        setEditingNews(null);
        toast({
          title: "Новость обновлена",
          description: "Изменения сохранены",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить новость",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Удалить эту новость?")) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setNews((prev) => prev.filter((n) => n.id !== id));
        toast({
          title: "Новость удалена",
          description: "Новость успешно удалена",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить новость",
        variant: "destructive",
      });
    }
  };

  // Content management
  const handleUpdateContent = async (
    type: "rules" | "privacy" | "terms",
    content: ContentItem,
  ) => {
    try {
      const response = await fetch(`/api/${type}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(content),
      });

      if (response.ok) {
        const updated = await response.json();

        if (type === "rules") setRules(updated);
        else if (type === "privacy") setPrivacy(updated);
        else if (type === "terms") setTerms(updated);

        toast({
          title: "Контент обновлен",
          description: `${type === "rules" ? "Правила" : type === "privacy" ? "Политика" : "Условия"} успешно обновлены`,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить контент",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminAuth>
        <div className="flex items-center justify-center h-96">
          <div className="text-gaming-text">Загрузка...</div>
        </div>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Settings className="w-8 h-8 text-gaming-accent mr-3" />
            <h1 className="text-3xl font-bold text-gaming-text">
              Панель администратора
            </h1>
          </div>

          <Tabs defaultValue="news" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md bg-gaming-card border-gaming-border">
              <TabsTrigger
                value="news"
                className="data-[state=active]:bg-gaming-accent data-[state=active]:text-black"
              >
                Новости
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                className="data-[state=active]:bg-gaming-accent data-[state=active]:text-black"
              >
                Правила
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="data-[state=active]:bg-gaming-accent data-[state=active]:text-black"
              >
                Политика
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="data-[state=active]:bg-gaming-accent data-[state=active]:text-black"
              >
                Условия
              </TabsTrigger>
            </TabsList>

            {/* News Management */}
            <TabsContent value="news" className="space-y-6">
              {/* Create News */}
              <Card className="bg-gaming-card border-gaming-border">
                <CardHeader>
                  <CardTitle className="text-gaming-text flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Создать новость
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newsTitle" className="text-gaming-text">
                      Заголовок
                    </Label>
                    <Input
                      id="newsTitle"
                      value={newNews.title}
                      onChange={(e) =>
                        setNewNews((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                      placeholder="Введите заголовок новости"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsContent" className="text-gaming-text">
                      Содержимое
                    </Label>
                    <Textarea
                      id="newsContent"
                      value={newNews.content}
                      onChange={(e) =>
                        setNewNews((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      className="bg-gaming-bg border-gaming-border text-gaming-text min-h-[120px]"
                      placeholder="Введите содержимое новости"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsAuthor" className="text-gaming-text">
                      Автор
                    </Label>
                    <Input
                      id="newsAuthor"
                      value={newNews.author}
                      onChange={(e) =>
                        setNewNews((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                    />
                  </div>
                  <Button
                    onClick={handleCreateNews}
                    className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать новость
                  </Button>
                </CardContent>
              </Card>

              {/* News List */}
              <div className="space-y-4">
                {news.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-gaming-card border-gaming-border"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gaming-text">
                          {article.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              article.published
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {article.published ? "Опубликовано" : "Черновик"}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNews(article)}
                            className="border-gaming-border text-gaming-text hover:bg-gaming-bg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNews(article.id)}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gaming-text-muted text-sm">
                        {article.author} •{" "}
                        {new Date(article.date).toLocaleDateString("ru-RU")}
                      </p>
                    </CardHeader>
                    {editingNews?.id === article.id ? (
                      <CardContent className="space-y-4">
                        <Input
                          value={editingNews.title}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              title: e.target.value,
                            })
                          }
                          className="bg-gaming-bg border-gaming-border text-gaming-text"
                        />
                        <Textarea
                          value={editingNews.content}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              content: e.target.value,
                            })
                          }
                          className="bg-gaming-bg border-gaming-border text-gaming-text min-h-[120px]"
                        />
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleUpdateNews(editingNews)}
                            className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Сохранить
                          </Button>
                          <Button
                            onClick={() => setEditingNews(null)}
                            variant="outline"
                            className="border-gaming-border text-gaming-text hover:bg-gaming-bg"
                          >
                            Отмена
                          </Button>
                        </div>
                      </CardContent>
                    ) : (
                      <CardContent>
                        <p className="text-gaming-text-muted">
                          {article.content.substring(0, 200)}...
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Rules Management */}
            <TabsContent value="rules">
              {rules && (
                <Card className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <CardTitle className="text-gaming-text flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Правила сервера
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="rulesTitle" className="text-gaming-text">
                        Заголовок
                      </Label>
                      <Input
                        id="rulesTitle"
                        value={rules.title}
                        onChange={(e) =>
                          setRules({ ...rules, title: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="rulesContent"
                        className="text-gaming-text"
                      >
                        Содержимое
                      </Label>
                      <Textarea
                        id="rulesContent"
                        value={rules.content}
                        onChange={(e) =>
                          setRules({ ...rules, content: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text min-h-[300px]"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateContent("rules", rules)}
                      className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить правила
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Privacy Policy Management */}
            <TabsContent value="privacy">
              {privacy && (
                <Card className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <CardTitle className="text-gaming-text flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Политика конфиденциальности
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label
                        htmlFor="privacyTitle"
                        className="text-gaming-text"
                      >
                        Заголовок
                      </Label>
                      <Input
                        id="privacyTitle"
                        value={privacy.title}
                        onChange={(e) =>
                          setPrivacy({ ...privacy, title: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="privacyContent"
                        className="text-gaming-text"
                      >
                        Содержимое
                      </Label>
                      <Textarea
                        id="privacyContent"
                        value={privacy.content}
                        onChange={(e) =>
                          setPrivacy({ ...privacy, content: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text min-h-[300px]"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateContent("privacy", privacy)}
                      className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить политику
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Terms Management */}
            <TabsContent value="terms">
              {terms && (
                <Card className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <CardTitle className="text-gaming-text flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      П��льзовательское соглашение
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="termsTitle" className="text-gaming-text">
                        Заголовок
                      </Label>
                      <Input
                        id="termsTitle"
                        value={terms.title}
                        onChange={(e) =>
                          setTerms({ ...terms, title: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="termsContent"
                        className="text-gaming-text"
                      >
                        Содержимое
                      </Label>
                      <Textarea
                        id="termsContent"
                        value={terms.content}
                        onChange={(e) =>
                          setTerms({ ...terms, content: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text min-h-[300px]"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateContent("terms", terms)}
                      className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить усл��вия
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AdminAuth>
  );
}
