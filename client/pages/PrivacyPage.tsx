import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  const [privacy, setPrivacy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacy();
  }, []);

  const fetchPrivacy = async () => {
    try {
      const response = await fetch('/api/privacy');
      if (response.ok) {
        const data = await response.json();
        setPrivacy(data.content || getDefaultPrivacy());
      } else {
        setPrivacy(getDefaultPrivacy());
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      setPrivacy(getDefaultPrivacy());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPrivacy = () => {
    return `# Политика конфиденциальности RSGS

## Введение

Данная Политика конфиденциальности описывает, как Russian Squad Game Servers (RSGS) собирает, использует и защищает информацию, которую вы предоставляете при использовании наших игровых серверов и веб-сайта.

Используя наши услуги, вы соглашаетесь с условиями данной политики конфиденциальности.

## Какие данные мы собир��ем

### Игровые данные
- Steam ID для идентификации игроков
- Игровая статистика и достижения
- История матчей и результаты
- Настройки профиля игрока

### Данные модерации
- Сообщения в игровом чате
- Голосовые команды и координация
- Отчеты о нарушениях
- История административных действий

### Технические данные
- IP-адрес для подключения к серверу
- Системная информация для оптимизации
- Логи подключений и отключений
- Данные о производительности

## Как мы используем ваши данные

Собранные данные используются исключительно для следующих целей:

1. Обеспечение функционирования игровых серверов
2. Модерация и поддержание порядка в игре
3. Улучшение игрового опыта и баланса
4. Предотвращение читерства и нарушений
5. Техническая поддержка игроков
6. Анализ производительности серверов

## Защита данных

### Технические меры
- Шифрование данных при передаче
- Безопасное хранение на защищенных серверах
- Регулярное обновление систем безопасности
- Мониторинг несанкционированного доступа

### Организационные меры
- Ограниченный доступ к данным
- Обучение персонала по безопасности
- Политики конфиденциальности для сотрудников
- Регулярные аудиты безопасности

## Ваши права

**Право на информацию** - Вы можете запросить информацию о том, какие данные мы собираем о вас

**Право на исправление** - Вы можете запросить исправление неточных или неполных данных

**Право на удаление** - Вы можете запросить удаление ваших персональных данных

**Право на ограничение** - Вы можете запросить ограничение обработки ваших данных

## Контактная информация

Если у вас есть вопросы о нашей политике конфиденциальности или вы хотите воспользоваться своими правами, свяжитесь с нами:

**Email:** privacy@rgs-squad.ru
**Discord:** [RSGS Community](https://discord.gg/HXne8JVJ)

## Изменения в политике

Мы можем обновлять данную политику конфиденциальности по мере необходимости. Все изменения будут опубликованы на этой странице.

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
                <Shield className="w-8 h-8 text-gaming-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gaming-text mb-4">
              Политика конфиденциальности
            </h1>
            <p className="text-xl text-gaming-text-muted">
              Как мы собираем, используем и защищаем ваши данные
            </p>
          </div>

          {/* Content */}
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
            <div className="prose prose-invert max-w-none">
              {formatText(privacy)}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
