import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Book, Target, Users, Shield } from "lucide-react";

const guides = [
  {
    id: 1,
    title: "Основы игры в Squad",
    description: "Изучите базовые механики игры, управление и интерфейс",
    icon: <Book className="w-6 h-6" />,
    difficulty: "Новичок",
    readTime: "10 мин",
  },
  {
    id: 2,
    title: "Тактика командной игры",
    description: "Координация с командой и эффективные стратегии",
    icon: <Users className="w-6 h-6" />,
    difficulty: "Средний",
    readTime: "15 мин",
  },
  {
    id: 3,
    title: "Снайперская подготовка",
    description: "Техники прицеливания и позиционирования снайпера",
    icon: <Target className="w-6 h-6" />,
    difficulty: "Продвинутый",
    readTime: "20 мин",
  },
  {
    id: 4,
    title: "Выживание на поле боя",
    description: "Как избежать смерти и эффективно использовать укрытия",
    icon: <Shield className="w-6 h-6" />,
    difficulty: "Средний",
    readTime: "12 мин",
  },
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Новичок":
      return "text-green-400";
    case "Средний":
      return "text-gaming-accent";
    case "Продвинутый":
      return "text-red-400";
    default:
      return "text-gaming-text-muted";
  }
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Гайды и <span className="text-gaming-accent">обучение</span>
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto">
              Изучите тактики и стратегии для эффективной игры на серверах RSGS.
              От основ до продвинутых техник.
            </p>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-gaming-card border border-gaming-border rounded-lg p-6 hover:bg-gaming-card-hover transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center text-gaming-accent">
                        {guide.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gaming-text mb-2">
                        {guide.title}
                      </h3>
                      <p className="text-gaming-text-muted mb-4">
                        {guide.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={getDifficultyColor(guide.difficulty)}>
                            {guide.difficulty}
                          </span>
                          <span className="text-gaming-text-muted">
                            {guide.readTime}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gaming-border text-gaming-text hover:bg-gaming-accent hover:text-black"
                        >
                          Читать
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gaming-text mb-6">
              Скоро появятся новые гайды
            </h2>
            <p className="text-gaming-text-muted mb-8">
              Мы работаем над созданием подробных обучающих материалов.
              Следите за обновлениями!
            </p>
            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
              <p className="text-gaming-accent font-semibold">
                Планируемые темы:
              </p>
              <ul className="text-gaming-text-muted mt-2 space-y-1">
                <li>• Продвинутая тактика для Squad Leader</li>
                <li>• Эффективное использование техники</li>
                <li>• Координация воздушной поддержки</li>
                <li>• Построение укреплений и обороны</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
