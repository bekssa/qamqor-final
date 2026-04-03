import React from "react";
import { Shield, CheckCircle, Zap, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export default function Advantages() {
  const advantages = [
    {
      id: 1,
      title: "Безопасность данных",
      description: "Все личные данные надежно защищены шифрованием. Мы гарантируем полную конфиденциальность и анонимность.",
      icon: <Shield className="h-8 w-8 text-primary" />,
      color: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      id: 2,
      title: "Проверенные специалисты",
      description: "Каждый помощник проходит строгую проверку документов, собеседование и обучение перед началом работы.",
      icon: <CheckCircle className="h-8 w-8 text-secondary" />,
      color: "bg-green-50 dark:bg-green-950/20"
    },
    {
      id: 3,
      title: "Быстрый поиск помощи",
      description: "Умный алгоритм подбора находит ближайшего подходящего специалиста в течение нескольких минут.",
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      color: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      id: 4,
      title: "AI поддержка",
      description: "Встроенный искусственный интеллект помогает круглосуточно отвечать на вопросы и координировать заявки.",
      icon: <BrainCircuit className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-950/20"
    }
  ];

  return (
    <section className="py-24 bg-card/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Наши преимущества</h2>
          <p className="text-lg text-muted-foreground">
            Почему тысячи людей доверяют платформе Qamqor заботу о своих близких.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {advantages.map((adv, index) => (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col sm:flex-row gap-6 bg-card border rounded-2xl p-8 shadow-sm"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${adv.color}`}>
                {adv.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">{adv.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {adv.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
