import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export default function RulesPage() {
  const [rules, setRules] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/rules');
      if (response.ok) {
        const data = await response.json();
        setRules(data.content || getDefaultRules());
      } else {
        setRules(getDefaultRules());
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
      setRules(getDefaultRules());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRules = () => {
    return `**Общие положения:**

● - При подключении к серверу игрок автоматически соглашается с правилами сервера и обязуется их с��блюдать.
● - Все игроки обязаны соблюдать правила сервера. Правила разработаны с целью обеспечения справедливой, уважительной и комфортной игровой среды.
● - Попытки обхода правил, злоупотребление ими, использование игровых уязвимостей или лазеек наказываются строже.
● - Администрация вправе изменять правила сервера в любой момент.
● - Незнание правил не освобождает от ответственности за их нарушение.

**NickName и Clan-teg запрещено:**
● оскорбления, провокации и мат;
● фашизм и нацизм;
● эротику, порнографию, описание и/или название интимных частей тела;
● политику и рекламу;
● ссылки на стороннее ПО и/или вредоносные ресурсы;
● названия запрещённых организаций;

**Основные правила (1.1 – 1.10):**
1.1. Запрещено игнорировать указа��ия Командира (если не нарушают правила)
1.2. Тимкилл, саботаж, уничтожение союзной техники, слив информации
1.3. Музыка/звуки на предварительной фазе и конце игры, если мешают
1.4. Оскорбление с целью ухудшить игровой процесс(лёгкие оскорбления прощается на 1 раз)
1.5. Провокации и конфликты
1.6. Спам, оффтоп, флуд
1.7. Ввод в заблуждение администрации или игроков
1.8. Запрещено использование багов, макросов(которые дают большое преимущество)
1.9. Использование стороннего ПО (читы)
1.10. Несогласованная реклама с администрацией сервера(...)

**Правила формирования и управления отрядом (2.1 - 2.7):**
2.1. Командир отряда обязан иметь микрофон и быть Адекватным
2.2. Командир имеет право исключить любого игрока без объяснений
2.3. Командиры обязаны выполнять приказы CMD
2.4. Передача роли Командира отряда без согласия запрещена
2.5. Поддержка: до 3 чел. (ПТУР, миномёты, логистика), без тандема, 3 отряд на сторону
2.6. Строители: до 5 чел., без тандема, 1 отряд на сторону
2.7. Пехота может брать лёгкую технику(легко бронированную) и crewman-технику при отсутствии претензий от техотряда

**Правила игры ДРГ (3.1 - 3.4):**
3.1. ДРГ — отряд за пределами точек, выполняющий разведку/диверсии
3.2. Состав: 1–4 чел.
3.3. Только 1 ДРГ на сторону
3.4. Нельзя брать 'Соплю'/мобильный HUB без согласия CMD (или других командиров при его отсутствии)

**Разрешение споров за технику (4.1 - 4.5):**
4.1. В подготовительной фазе: кто первый занял — того и техника
4.2. После старта — спор через !roll при наличии экипажа (2 crewman или 1 pilot).
4.2.1. В сп��ре участвуют только командиры отрядов
4.3. Кто первый сел с экипажем — не обязан roll'ить
4.4. Если спор решён, новый отряд не инициирует новый roll
4.5. Если вступил в новый спор — теряешь предыдущую технику

**Средняя и тяжёлая техника (5.1 - 5.6):**
5.1. Экипаж: 2–4 человека, без тандема
5.2. Один юнит техники на отряд
5.3. В одиночку занимать технику — запрещено
5.4. Запрещено удерживать, блокировать или сажать игрока в технику на мейне
5.5. Разрешена игра вне точек — с согласия CMD (или других SL при его отсутствии)
5.6. Управление Бегемотом разрешено соло

**Правила игры на воздушной технике (6.1 - 6.7):**
6.1. Авиаотряд: 1–3 чел., без тандема
6.2. Командир должен иметь kit lead pilot
6.3. Разрешено брать 2+ вертолёта при отсутствии других авиаотрядов и согласии CMD
6.4. Запрещено выполнять "бочку"(Наказание последуют за неудавшуюся попытку)
6.5. Управлять может только пилот с опытом
6.6. Пехотный командирский отряд может взять вертолёт для снабжения при согласии CMD
6.7. AH-1Z запрещён в одиночном управлении

**Правила использования звуков (7.1 - 7.2):**
7.1. Запрещено использовать посторонние звуки(мешающие игровому процессу)
7.2. Разрешено использование Soundpad'а (для атмосферы игры)

**Администрация сервера (8.1 - 8.4):**
8.1. Система наказаний: предупреждение → кик → бан
8.2. За негрубое нарушение — минимальное наказание
8.3. Во всех неописанных ситуациях администрация действует по принципу добросовестности и разумности
8.4. Если администрация не справедлива, обращайтесь к вышестоящему составу`;
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        // Bold headers
        return (
          <h3 key={index} className="text-xl font-bold text-gaming-accent mt-6 mb-3">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      } else if (line.match(/^\d+\.\d+\./)) {
        // Numbered rules
        return (
          <p key={index} className="text-gaming-text mb-2 pl-4">
            <span className="font-semibold text-gaming-accent">{line.match(/^\d+\.\d+\./)?.[0]}</span>
            {line.replace(/^\d+\.\d+\./, '')}
          </p>
        );
      } else if (line.startsWith('●')) {
        // Bullet points
        return (
          <p key={index} className="text-gaming-text mb-2 pl-4">
            <span className="text-gaming-accent mr-2">●</span>
            {line.substring(1).trim()}
          </p>
        );
      } else if (line.trim()) {
        // Regular text
        return (
          <p key={index} className="text-gaming-text mb-2">
            {line}
          </p>
        );
      } else {
        // Empty line
        return <br key={index} />;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gaming-text">Загрузка правил...</div>
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
              Правила сервера
            </h1>
            <p className="text-xl text-gaming-text-muted">
              Обязательные правила для всех игроков серверов RSGS
            </p>
          </div>

          {/* Rules Content */}
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
            <div className="prose prose-invert max-w-none">
              {formatText(rules)}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <div className="bg-gaming-card border border-gaming-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-gaming-accent mb-2">
                Обжалование наказаний
              </h3>
              <p className="text-gaming-text-muted mb-4">
                Считаете, что получили несправедливое наказание? 
                Обратитесь к администрации через Discord.
              </p>
              <a
                href="https://discord.gg/HXne8JVJ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold rounded-md transition-colors"
              >
                Обжаловать в Discord
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
