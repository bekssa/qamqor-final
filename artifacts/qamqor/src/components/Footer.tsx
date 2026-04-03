import React from "react";
import { Link } from "wouter";
import { Heart, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold text-primary tracking-tight">Qamqor</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Забота и помощь пожилым людям и людям с особыми потребностями. Мы создаем сообщество неравнодушных людей.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Навигация</h3>
            <ul className="space-y-4">
              <li><a href="#hero" className="text-muted-foreground hover:text-primary transition-colors text-sm">Главная</a></li>
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm">Как это работает</a></li>
              <li><a href="#find-helpers" className="text-muted-foreground hover:text-primary transition-colors text-sm">Услуги</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors text-sm">Отзывы</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Пользователям</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Найти помощника</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Стать волонтером</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Стать специалистом</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Частые вопросы</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">г. Астана, ул. Мангилик Ел, 14</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+77001234567" className="text-muted-foreground hover:text-primary transition-colors text-sm">+7 (700) 123-45-67</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@qamqor.kz" className="text-muted-foreground hover:text-primary transition-colors text-sm">info@qamqor.kz</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Qamqor. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Политика конфиденциальности</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
