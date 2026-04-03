import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardEdit, Search, HeartHandshake, MessageSquare } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Создайте заявку",
      description: "Опишите, какая именно помощь вам нужна — медицинская, бытовая или сопровождение.",
      icon: <ClipboardEdit className="h-8 w-8 text-primary" />
    },
    {
      id: 2,
      title: "Найдите помощника",
      description: "Система подберет проверенных специалистов и волонтеров поблизости.",
      icon: <Search className="h-8 w-8 text-primary" />
    },
    {
      id: 3,
      title: "Получите помощь",
      description: "Свяжитесь с помощником, договоритесь о деталях и получите необходимую заботу.",
      icon: <HeartHandshake className="h-8 w-8 text-primary" />
    },
    {
      id: 4,
      title: "Оставьте отзыв",
      description: "Поделитесь впечатлениями, чтобы помочь другим пользователям сделать выбор.",
      icon: <MessageSquare className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Как это работает?</h2>
          <p className="text-lg text-muted-foreground">
            Простой и понятный процесс от создания заявки до получения помощи.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 border shadow-sm flex flex-col items-center text-center relative"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{step.description}</p>
              <Button variant="link" className="text-primary p-0 h-auto font-medium">
                Подробнее
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
