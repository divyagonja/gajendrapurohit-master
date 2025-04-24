import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedBackground from "@/components/AnimatedBackground";

const Hero = () => {
  
  const scrollToSection = (sectionId: string) => {
    document.querySelector(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };
  
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Portrait image background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/182A4172-e1728803050785.jpg" 
          alt="Dr. Gajendra Purohit" 
          className="w-full h-full object-cover object-top opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/50"></div>
      </div>

      <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <TextReveal>
              <span className="inline-block text-lg md:text-xl text-primary font-medium animate-bounce-in">
                Wadup!
              </span>
            </TextReveal>

            <TextReveal delay={200}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mt-4 mb-6 animate-bounce-in delay-200">
                Dr. Gajendra Purohit
              </h1>
            </TextReveal>

            <TextReveal delay={400}>
              <p className="text-lg md:text-xl text-muted-foreground mt-6 mb-10 animate-slide-up delay-400">
                YouTuber & Founder of Mathscare, inspiring students with motivational talks & educational content.
              </p>
            </TextReveal>

            <AnimatedSection delay={600}>
              <div className="mt-10 flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="mr-4 relative animated-gradient-btn bg-white/20 text-foreground hover:!bg-opacity-0 transition-all duration-300 dark:text-white dark:bg-primary/20"
                  onClick={() => scrollToSection("#about")}
                >
                  <span className="relative z-10 font-semibold text-foreground dark:text-white">View My Work</span>
                  <span className="absolute inset-0 rounded-xl animate-glow-border"></span>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="z-10 border-primary/50 text-foreground hover:bg-primary/10 dark:border-white/40 dark:text-white dark:hover:bg-white/10"
                  onClick={() => scrollToSection("#contact")}
                >
                  Get In Touch
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => scrollToSection("#about")}
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
