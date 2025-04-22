import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedChannels from "@/components/FeaturedChannels";
import SocialLinks from "@/components/SocialLinks";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import EventsGallery from "@/components/EventsGallery";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href') || "";
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <FeaturedChannels />
      <SocialLinks />
      <EventsGallery />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;

