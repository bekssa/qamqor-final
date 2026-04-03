import React from "react";
import { Link } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isHighContrast, toggleHighContrast } = useAccessibility();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary tracking-tight">Qamqor</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <a href="#hero" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Главное</a>
            <a href="#how-it-works" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Как это работает</a>
            <a href="#find-helpers" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Услуги</a>
            <a href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Отзывы</a>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHighContrast}
            aria-label={isHighContrast ? "Отключить версию для слабовидящих" : "Версия для слабовидящих"}
            className="flex items-center gap-2"
          >
            {isHighContrast ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            <span className="hidden lg:inline">{isHighContrast ? "Обычная версия" : "Версия для слабовидящих"}</span>
          </Button>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" className="font-medium">Войти</Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Регистрация</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
