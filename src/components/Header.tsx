import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Add global styles for the animation
const headerStyles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
  
  @keyframes subtlePulse {
    0% { transform: scale(1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }
    50% { transform: scale(1.03); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3); }
    100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }
  }

  @keyframes shine {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes gradient-move {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", href: "#home" },
    { title: "About", href: "#about" },
    { title: "Channels", href: "#channels" },
    { title: "Socials", href: "#socials" },
    { title: "Motivational Talks", href: "#motivational-talks" },
    { title: "Contact", href: "#contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    document.querySelector(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-white dark:bg-background"
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a 
              href="#home" 
              className="text-xl font-bold relative z-10"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#home");
              }}
            >
              <span 
                className="bg-clip-text text-transparent animate-gradient-move"
                style={{
                  background: 'linear-gradient(90deg, #ff6b6b, #a18cd1, #fbc2eb, #45caff, #fad0c4, #6a5af9, #ff9a8b)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  textShadow: 'none'
                }}
              >
                Dr. Gajendra Purohit
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.title}
              </a>
            ))}
            <a 
              href="https://mathscare.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative px-4 py-1.5 rounded-full font-bold transition-all duration-300 hover:scale-105 group flex items-center justify-center"
              style={{
                background: 'linear-gradient(45deg, #71c9bb, #66c5a0, #5dc060)',
                backgroundSize: '300% 300%',
                boxShadow: '0 4px 15px rgba(93, 192, 96, 0.4)',
                animation: 'gradientShift 8s ease infinite',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
            >
              <span className="absolute inset-0 rounded-full opacity-70" 
                style={{
                  background: 'linear-gradient(45deg, #71c9bb, #66c5a0, #5dc060)',
                  backgroundSize: '300% 300%',
                  filter: 'blur(10px)',
                  zIndex: -1,
                  animation: 'gradientShift 8s ease infinite'
                }}
              />
              <img 
                src="/images/logos/mathscare.png" 
                alt="Mathscare Logo" 
                className="h-6 w-auto"
                style={{
                  filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3))'
                }}
              />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="block text-sm font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.title}
              </a>
            ))}
            <a 
              href="https://mathscare.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative px-4 py-1.5 rounded-full font-bold transition-all duration-300 hover:scale-105 group mt-2 flex items-center justify-center w-full"
              style={{
                background: 'linear-gradient(45deg, #71c9bb, #66c5a0, #5dc060)',
                backgroundSize: '300% 300%',
                boxShadow: '0 4px 15px rgba(93, 192, 96, 0.4)',
                animation: 'gradientShift 8s ease infinite',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
            >
              <span className="absolute inset-0 rounded-full opacity-70" 
                style={{
                  background: 'linear-gradient(45deg, #71c9bb, #66c5a0, #5dc060)',
                  backgroundSize: '300% 300%',
                  filter: 'blur(10px)',
                  zIndex: -1,
                  animation: 'gradientShift 8s ease infinite'
                }}
              />
              <img 
                src="/images/logos/mathscare.png" 
                alt="Mathscare Logo" 
                className="h-6 w-auto"
                style={{
                  filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3))'
                }}
              />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
