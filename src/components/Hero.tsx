import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Add Apple-style cursive font styles
const styleSheet = `
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap');

  @keyframes reveal {
    from { 
      clip-path: inset(0 100% 0 0);
    }
    to { 
      clip-path: inset(0 0 0 0);
    }
  }
  
  @keyframes cursorBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .apple-cursive-text {
    font-family: 'Pacifico', 'Dancing Script', cursive;
    font-weight: 500;
    display: inline-block;
    position: relative;
  }
  
  .apple-drawing-effect {
    color: var(--primary);
    background: linear-gradient(90deg, var(--primary), var(--primary));
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    position: relative;
    white-space: nowrap;
  }
  
  .apple-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: var(--primary);
    position: absolute;
    right: -4px;
    top: 50%;
    transform: translateY(-50%);
    animation: cursorBlink 1.2s infinite;
  }
`;

// Array of greetings in different languages
const greetings = [
  "Hello",
  "नमस्ते", // Namaste (Hindi)
  "வணக்கம்", // Vanakkam (Tamil)
  "ನಮಸ್ಕಾರ", // Namaskara (Kannada)
  "നമസ്കാരം", // Namaskaram (Malayalam)
  "안녕하세요", // Annyeonghaseyo (Korean) 
  "こんにちは", // Konnichiwa (Japanese)
  "你好", // Nǐ hǎo (Chinese)
  "Hola", // Spanish
  "Bonjour", // French
  "Ciao", // Italian
  "Hallo", // German
  "مرحبا", // Marhaba (Arabic)
];

const Hero = () => {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  // Writing animation
  useEffect(() => {
    // Reset when greeting changes
    setDisplayedText("");
    setIsComplete(false);
    
    const currentGreeting = greetings[currentGreetingIndex];
    let charIndex = 0;
    
    // Function to write the greeting character by character
    const writeText = () => {
      if (charIndex <= currentGreeting.length) {
        setDisplayedText(currentGreeting.substring(0, charIndex));
        charIndex++;
        
        if (charIndex <= currentGreeting.length) {
          // Slower, smoother typing: 120-220ms per character
          const speed = Math.floor(Math.random() * 100) + 120;
          setTimeout(writeText, speed);
        } else {
          setIsComplete(true);
          // Wait longer before transitioning to the next greeting (2.5 seconds)
          setTimeout(() => {
            setShowCursor(false);
            setTimeout(() => {
              setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length);
              setShowCursor(true);
            }, 500);
          }, 2500);
        }
      }
    };
    
    // Start the writing animation after a longer initial delay
    const timer = setTimeout(writeText, 800);
    
    return () => clearTimeout(timer);
  }, [currentGreetingIndex]);
  
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
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />
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
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentGreetingIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeInOut"
                }}
                className="h-16 md:h-20 mb-2 flex justify-center items-center"
              >
                <div className="relative overflow-visible">
                  <span className="apple-cursive-text apple-drawing-effect text-2xl md:text-3xl">
                    {displayedText}
                    {showCursor && <span className="apple-cursor"></span>}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

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
