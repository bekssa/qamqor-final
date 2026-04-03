import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Ирина Петровна",
    role: "Пользователь",
    text: "Очень удобный сервис! Быстро нашла помощника. Девушка пришла вовремя, очень вежливая и аккуратная. Помогла с уборкой и сходила в аптеку за лекарствами. Спасибо создателям!",
  },
  {
    id: 2,
    name: "Николай Иванович",
    role: "Пользователь",
    text: "Замечательная платформа. Помощник пришел вовремя. У меня проблемы с ногами, тяжело выходить на улицу. Теперь ко мне регулярно приходит волонтер, помогает по дому и мы просто общаемся.",
  },
  {
    id: 3,
    name: "Светлана Ахметова",
    role: "Опекун",
    text: "Рекомендую всем! Очень профессиональные специалисты. Я искала сиделку для мамы на время моего отпуска. Нашла через Qamqor замечательную женщину с медицинским образованием. Я была спокойна всю поездку.",
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Отзывы пользователей</h2>
          <p className="text-lg text-muted-foreground">
            Узнайте, как Qamqor меняет жизни людей к лучшему.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground/80 italic mb-8 flex-grow">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <Avatar className="h-12 w-12 border bg-muted">
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                    {review.name.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
