import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    id: 1,
    title: "Выгодный VIP",
    subtitle: "Проходка для себя или клана",
    description: "Получите доступ к эксклюзивным возможностям и преимуществам",
    background: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
  },
  {
    id: 2,
    title: "Премиум доступ",
    subtitle: "Расширенные возможности",
    description: "Доступ к закрытым серверам и дополнительным функциям",
    background: "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900",
  },
  {
    id: 3,
    title: "Командная игра",
    subtitle: "Тактические преимущества",
    description:
      "Инструменты для координации команды и страте��ического планирования",
    background: "bg-gradient-to-r from-green-900 via-green-800 to-green-900",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Background with overlay */}
      <div className={`absolute inset-0 ${currentHero.background}`}>
        {/* Soldier silhouette overlay */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-black/30 to-transparent">
          <div className="absolute right-8 top-8 w-64 h-64 md:w-80 md:h-80 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
              <path d="M50 10 L60 25 L50 30 L55 45 L65 50 L55 65 L50 70 L45 65 L35 50 L45 45 L50 30 L40 25 Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {currentHero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gaming-accent mb-4">
              {currentHero.subtitle}
            </p>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              {currentHero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/vip">
                <Button
                  size="lg"
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold px-8"
                >
                  Получить VIP
                </Button>
              </Link>
              <a
                href="https://discord.gg/HXne8JVJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Присоединиться к Discord
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gaming-accent transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gaming-accent transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-gaming-accent"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
