import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FindHelpers from "@/components/FindHelpers";
import Advantages from "@/components/Advantages";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1">
        <Hero />
        <HowItWorks />
        <FindHelpers />
        <Advantages />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
