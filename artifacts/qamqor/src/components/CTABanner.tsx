import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CTABanner() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
              Начните пользоваться сервисом уже сегодня
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
              Присоединяйтесь к Qamqor, чтобы получать качественную помощь или помогать тем, кто в этом нуждается.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-8 text-base border-0">
                Зарегистрироваться
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-14 px-8 text-base backdrop-blur-sm">
                Найти помощника
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
