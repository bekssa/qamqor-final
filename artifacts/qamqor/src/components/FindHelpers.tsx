import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const helpers = [
  { id: 1, name: "Алия К.", age: 28, specialization: "Медицинская помощь", rating: 4.9, reviews: 47, distance: "0.8 км" },
  { id: 2, name: "Мирас Т.", age: 35, specialization: "Бытовые услуги", rating: 4.7, reviews: 31, distance: "1.2 км" },
  { id: 3, name: "Динара С.", age: 24, specialization: "Сопровождение", rating: 5.0, reviews: 23, distance: "2.1 км" },
  { id: 4, name: "Айдос Н.", age: 41, specialization: "Медицинская помощь", rating: 4.8, reviews: 52, distance: "1.5 км" },
  { id: 5, name: "Зарина Б.", age: 30, specialization: "Бытовые услуги", rating: 4.9, reviews: 18, distance: "3.0 км" },
  { id: 6, name: "Кайрат У.", age: 38, specialization: "Сопровождение", rating: 4.6, reviews: 14, distance: "0.5 км" },
];

const categories = ["Все", "Медицинская помощь", "Бытовые услуги", "Сопровождение"];

export default function FindHelpers() {
  const [activeCategory, setActiveCategory] = useState("Все");

  const filteredHelpers = activeCategory === "Все" 
    ? helpers 
    : helpers.filter(h => h.specialization === activeCategory);

  return (
    <section id="find-helpers" className="py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Найдите помощников рядом с вами</h2>
            <p className="text-lg text-muted-foreground">
              Наши специалисты и волонтеры готовы оказать необходимую поддержку в любое время.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex border-primary text-primary hover:bg-primary/5">
            Показать всех
          </Button>
        </div>

        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full whitespace-nowrap ${
                activeCategory === category 
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHelpers.slice(0, 3).map((helper, index) => (
            <motion.div
              key={helper.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg">
                      {helper.name.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{helper.name}, {helper.age}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium text-foreground">{helper.rating}</span>
                      <span className="mx-1.5">•</span>
                      <span>{helper.reviews} отзывов</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="font-medium text-foreground">{helper.specialization}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mr-3 shrink-0">
                    <MapPin className="h-4 w-4 text-secondary" />
                  </div>
                  <span>{helper.distance} от вас</span>
                </div>
              </div>
              
              <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                Связаться
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 w-full">
            Показать всех
          </Button>
        </div>
      </div>
    </section>
  );
}
