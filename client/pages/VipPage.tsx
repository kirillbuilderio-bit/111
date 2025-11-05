import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Star, Shield, Zap, Users } from "lucide-react";
import VipPaymentModal from "@/components/VipPaymentModal";

const vipFeatures = [
  {
    icon: <Star className="w-6 h-6" />,
    title: "Приоритетная очередь",
    description: "Подключайтесь к серверам без ожидания",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Защита от кика",
    description: "Защит�� от автоматического отключения",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Эксклюзивные функции",
    description: "Доступ к дополнительным возможностям в игре",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "VIP сообщество",
    description: "Доступ к закрытому VIP чату и каналам",
  },
];

const vipPlans = [
  {
    name: "VIP 1 месяц",
    price: "299 ₽",
    duration: "30 дней",
    popular: false,
  },
  {
    name: "VIP 3 месяца",
    price: "799 ₽",
    duration: "90 дней",
    popular: true,
    discount: "Скидка 11%",
  },
  {
    name: "VIP 6 месяцев",
    price: "1499 ₽",
    duration: "180 дней",
    popular: false,
    discount: "Скидка 17%",
  },
  {
    name: "VIP 1 год",
    price: "2799 ₽",
    duration: "365 дней",
    popular: false,
    discount: "Скидка 22%",
  },
];

export default function VipPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof vipPlans[0] | null>(null);

  const handleBuyVip = (plan: typeof vipPlans[0]) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-gaming-card via-gaming-bg to-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Станьте <span className="text-gaming-accent">VIP</span> игроком
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto mb-8">
              Получите эксклюзивные преимущества и возможности для лучшего
              игрового опыта на серверах RSGS. Приоритетное подключение, защита
              от кика и многое другое.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text text-center mb-12">
              Преимущества VIP ��татуса
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {vipFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gaming-accent/20 rounded-full text-gaming-accent mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gaming-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gaming-text-muted">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text text-center mb-12">
              Выберите подходящий план
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vipPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-gaming-card border-2 rounded-lg p-6 ${
                    plan.popular
                      ? "border-gaming-accent"
                      : "border-gaming-border hover:border-gaming-accent/50"
                  } transition-colors`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gaming-accent text-black px-4 py-1 rounded-full text-sm font-semibold">
                        Популяр��ый
                      </span>
                    </div>
                  )}

                  {plan.discount && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        {plan.discount}
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gaming-text mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-gaming-accent mb-1">
                      {plan.price}
                    </div>
                    <p className="text-gaming-text-muted mb-6">
                      {plan.duration}
                    </p>

                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-gaming-text">
                        <Check className="w-5 h-5 text-gaming-accent mr-2" />
                        Приоритетная очередь
                      </li>
                      <li className="flex items-center text-gaming-text">
                        <Check className="w-5 h-5 text-gaming-accent mr-2" />
                        Защита от кика
                      </li>
                      <li className="flex items-center text-gaming-text">
                        <Check className="w-5 h-5 text-gaming-accent mr-2" />
                        VIP сообщество
                      </li>
                      <li className="flex items-center text-gaming-text">
                        <Check className="w-5 h-5 text-gaming-accent mr-2" />
                        Поддержка 24/7
                      </li>
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                          : "bg-gaming-border hover:bg-gaming-accent hover:text-black text-gaming-text"
                      }`}
                      size="lg"
                      onClick={() => handleBuyVip(plan)}
                    >
                      Купить VIP
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text text-center mb-12">
              Частые вопросы
            </h2>

            <div className="space-y-6">
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gaming-text mb-2">
                  Как активируется VIP статус?
                </h3>
                <p className="text-gaming-text-muted">
                  VIP статус активируется автоматически после оплаты в течение
                  5-10 минут. Вы получите у��едомление в Discord о активации.
                </p>
              </div>

              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gaming-text mb-2">
                  На каких серверах действует VIP?
                </h3>
                <p className="text-gaming-text-muted">
                  VIP статус действует на всех серверах RSGS: Free, #1, Invasion
                  �� International.
                </p>
              </div>

              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gaming-text mb-2">
                  Можно ли вернуть деньги?
                </h3>
                <p className="text-gaming-text-muted">
                  Возврат средств возможен в течение 7 дней после покупки при
                  условии, что VIP статус не использовался.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <VipPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
