import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
                  WebkitBackgroundClip: 'text'
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
              className="relative px-4 py-1.5 rounded-full font-bold transition-transform hover:scale-105 group"
              style={{
                background: 'linear-gradient(90deg, #ff6b6b, #a18cd1, #fbc2eb, #45caff, #fad0c4, #6a5af9, #ff9a8b)',
                backgroundSize: '300% 300%'
              }}
            >
              <span className="animate-gradient-move absolute inset-0 rounded-full opacity-75" 
                style={{
                  background: 'linear-gradient(90deg, #ff6b6b, #a18cd1, #fbc2eb, #45caff, #fad0c4, #6a5af9, #ff9a8b)',
                  backgroundSize: '300% 300%',
                  filter: 'blur(8px)',
                  zIndex: -1
                }}
              />
              <span className="text-white">
                Mathscare
              </span>
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
              className="relative px-4 py-1.5 rounded-full font-bold transition-transform hover:scale-105 group w-full block text-center mt-2"
              style={{
                background: 'linear-gradient(90deg, #ff6b6b, #a18cd1, #fbc2eb, #45caff, #fad0c4, #6a5af9, #ff9a8b)',
                backgroundSize: '300% 300%'
              }}
            >
              <span className="animate-gradient-move absolute inset-0 rounded-full opacity-75" 
                style={{
                  background: 'linear-gradient(90deg, #ff6b6b, #a18cd1, #fbc2eb, #45caff, #fad0c4, #6a5af9, #ff9a8b)',
                  backgroundSize: '300% 300%',
                  filter: 'blur(8px)',
                  zIndex: -1
                }}
              />
              <span className="text-white">
                Mathscare
              </span>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
