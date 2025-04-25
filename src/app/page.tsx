import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedChannels from "@/components/FeaturedChannels";
import SocialLinks from "@/components/SocialLinks";
import EventsGallery from "@/components/EventsGallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MotivationalTalks from "@/components/MotivationalTalks";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <About />
      <FeaturedChannels />
      <MotivationalTalks />
      <SocialLinks />
      <EventsGallery />
      <Contact />
      <Footer />
    </main>
  );
} 