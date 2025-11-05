import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClasses =
      "transition-all duration-200 font-medium px-3 py-2 rounded-md relative";
    return isActive(path)
      ? `${baseClasses} text-gaming-accent bg-gaming-accent/10 border-b-2 border-gaming-accent`
      : `${baseClasses} text-gaming-text hover:text-gaming-accent hover:bg-gaming-card`;
  };

  return (
    <header className="bg-gaming-bg border-b border-gaming-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gaming-accent rounded-md flex items-center justify-center">
                <span className="text-black font-bold text-xl">R</span>
              </div>
              <span className="text-gaming-text font-bold text-xl">RSGS</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getLinkClassName("/")}>
              Главная
            </Link>
            <Link to="/news" className={getLinkClassName("/news")}>
              Новости
            </Link>
            <Link to="/guides" className={getLinkClassName("/guides")}>
              Гайды
            </Link>
            <a
              href="https://squadcalc.rgs-squad.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gaming-text hover:text-gaming-accent transition-colors font-medium"
            >
              Squad Calc
            </a>
            <Link to="/rules" className={getLinkClassName("/rules")}>
              Правила
            </Link>
            <a
              href="https://discord.gg/HXne8JVJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gaming-text hover:text-gaming-accent transition-colors font-medium"
            >
              Обжаловать бан
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* VIP Button */}
            <Link to="/vip">
              <Button
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold"
                size="sm"
              >
                Стать VIP
              </Button>
            </Link>

            {/* User Profile */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gaming-text hover:text-gaming-accent hover:bg-gaming-card"
              onClick={() =>
                toast({
                  title: "В разработке",
                  description: "Функция авторизации находится в разработке",
                  duration: 3000,
                })
              }
            >
              <User className="w-4 h-4 mr-1" />
              Войти
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-gaming-text hover:text-gaming-accent"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
