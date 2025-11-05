import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export default function TermsPage() {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await fetch('/api/terms');
      if (response.ok) {
        const data = await response.json();
        setTerms(data.content || getDefaultTerms());
      } else {
        setTerms(getDefaultTerms());
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      setTerms(getDefaultTerms());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTerms = () => {
    return `# Пользовательское соглашение (Оферта)

## Общие полож��ния

Настоящее пользовательское соглашение (далее - "Соглашение") регулирует отношения между администрацией Russian Squad Game Servers (далее - "RSGS") и пользователями игровых серверов и связанных сервисов.

Подключаясь к серверам или используя наши услуги, вы автоматически соглашаетесь со всеми условиями данного соглашения.

## Условия предоставления услуг

1. Пользование серверами RSGS предоставляется на условиях данного соглашения
2. Администрация оставляет за собой право изменять условия обслуживания
3. Пользователь обязуется соблюдать правила сервера и игровой этикет
4. Запрещается использование читов, ботов и сторонних программ
5. Администрация не несет ответственности за потерю игрового прогресса
6. Возмещение средств возможно только в случаях, предусмотренных законом

## Обязанности пользователей

**Соблюдение правил** - Пользователь обязан соблюдать все установленные правила сервера

**Уважение к игрокам** - Поддержание дружелюбной атмосферы и взаимного уважения

**Честная игра** - Запрет на использование читов и эксплойтов

**Ответственность за аккаунт** - Пользователь несет полную ответственность за свой игровой аккаунт

## Запрещенные действия

- Использование читов, ботов или модификаций игры
- Намеренное нанесение вреда союзникам (Team Kill)
- Оскорбления, угрозы и дискриминация других игроков
- Спам в чате или голосовой связи
- Попытки взлома или нарушения безопасности серверов
- Продажа или передача игровых аккаунтов третьим лицам
- Использование багов и эксплойтов для получения преимуществ

## Условия VIP статуса

**Предоставление VIP** - VIP статус предоставляется на определенный срок согласно тарифному плану

**Область действия** - VIP привилегии действуют только на серверах RSGS

**Возврат средств** - Возврат средств за VIP статус возможен в течение 7 дней при отсутствии использования

**Лишение статуса** - Администрация может лишить VIP статуса за нарушение правил без возврата средств

**Отсутствие иммунитета** - VIP статус не защищает от наказаний за нарушение правил сервера

## Ответственность сторон

### Ответственность администрации
- Поддержание работоспособности серверов
- Обеспечение базовой модерации
- Защита персональных данных пользователей
- Предоставление технической поддержки

### Ответственность пользователя
- Соблюдение всех правил сервера
- Безопасность своего аккаунта
- Действия, совершенные с аккаунта
- Уважение к другим участникам

## Заключительные положения

Данное соглашение может быть изменено администрацией в одностороннем порядке. Уведомление об изменениях публикуется на сайте и в Discord сервере.

Продолжение использования сервисов после внесения изменений означает согласие с новыми условиями.

По вопросам соглашения обращайтесь: [Discord](https://discord.gg/HXne8JVJ)

Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}`;
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold text-gaming-accent mb-6">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gaming-text mt-8 mb-4">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-gaming-accent mt-6 mb-3">
            {line.substring(4)}
          </h3>
        );
      } else if (line.match(/^\d+\./)) {
        return (
          <p key={index} className="text-gaming-text mb-2 pl-4">
            <span className="font-semibold text-gaming-accent">{line.match(/^\d+\./)?.[0]}</span>
            {line.replace(/^\d+\./, '')}
          </p>
        );
      } else if (line.startsWith('- ')) {
        return (
          <p key={index} className="text-gaming-text mb-2 pl-4">
            <span className="text-gaming-accent mr-2">•</span>
            {line.substring(2)}
          </p>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="text-gaming-text mb-2">
            <span className="font-bold text-gaming-accent">{line.replace(/\*\*/g, '')}</span>
          </p>
        );
      } else if (line.trim()) {
        return (
          <p key={index} className="text-gaming-text mb-3 leading-relaxed">
            {line}
          </p>
        );
      } else {
        return <br key={index} />;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gaming-text">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gaming-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gaming-text mb-4">
              Пользовательское соглашение
            </h1>
            <p className="text-xl text-gaming-text-muted">
              Условия использования серверов и услуг RSGS
            </p>
          </div>

          {/* Content */}
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
            <div className="prose prose-invert max-w-none">
              {formatText(terms)}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
