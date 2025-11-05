import { Link } from "react-router-dom";
import { Youtube, MessageCircle, Music } from "lucide-react";

const footerSections = [
  {
    title: "Интересное",
    links: [
      { label: "Пользователи", href: "/users" },
      { label: "Новости", href: "/news" },
      { label: "Стать VIP", href: "/vip" },
    ],
  },
  {
    title: "Новинки",
    links: [
      { label: "Гайды", href: "/guides" },
      { label: "Безопасность игр", href: "/security" },
    ],
  },
  {
    title: "Инструменты",
    links: [
      { label: "Squad Calc", href: "/squad-calc" },
      { label: "Калькулятор", href: "/calculator" },
      { label: "Карты", href: "/maps" },
      { label: "Оружие", href: "/weapons" },
    ],
  },
  {
    title: "Игрения",
    links: [
      { label: "Ютуберы", href: "/youtubers" },
      { label: "Модераторы", href: "/moderators" },
      { label: "Анализаторы", href: "/analytics" },
    ],
  },
  {
    title: "Ссылки",
    links: [
      { label: "YouTube", href: "https://youtube.com", external: true },
      { label: "Discord", href: "https://discord.com", external: true },
      { label: "TikTok", href: "https://tiktok.com", external: true },
    ],
  },
];

const socialLinks = [
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    name: "Discord",
    href: "https://discord.com",
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: <Music className="w-5 h-5" />,
  },
];

const bottomLinks = [
  { label: "Игровые правила", href: "/rules" },
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Офферта", href: "/terms" },
  { label: "Сотрудничество", href: "/partnership" },
];

export default function Footer() {
  return (
    <footer className="bg-gaming-card border-t border-gaming-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {/* Logo Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gaming-accent rounded-md flex items-center justify-center">
                <span className="text-black font-bold text-xl">R</span>
              </div>
              <span className="text-gaming-text font-bold text-xl">RSGS</span>
            </div>
            <p className="text-gaming-text-muted text-sm mb-4">
              Лучшее игровое сообщество для тактических военных симуляторов.
              Присоединяйтесь к нашим серверам Squad.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gaming-text-muted hover:text-gaming-accent transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gaming-text mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gaming-text-muted hover:text-gaming-accent transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gaming-text-muted hover:text-gaming-accent transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gaming-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Bottom Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
              {bottomLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gaming-text-muted hover:text-gaming-accent transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gaming-text-muted text-sm text-center md:text-right">
              <p>© 2024 Russian Squad Game Servers</p>
              <p className="mt-1">Все права защищены</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
