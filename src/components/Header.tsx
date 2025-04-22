import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
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
    setIsOpen(false);
    document.querySelector(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a 
            href="#home" 
            className="text-2xl font-bold relative z-10"
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

          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="font-medium relative fancy-link group"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.title}
                <span className="absolute left-0 bottom-0 w-full h-1 z-0 pointer-events-none group-hover:animate-liquid-underline bg-gradient-to-r from-[#a18cd1] via-[#fbc2eb] to-[#fad0c4] rounded-full opacity-90 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
            ))}
            
            <a 
              href="https://mathscare.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative px-4 py-1.5 rounded-full font-bold transition-transform hover:scale-105 ml-2"
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
          </div>

          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-background/95 z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="flex flex-col items-center space-y-6">
          {navLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="text-xl font-medium hover:text-primary transition-colors"
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
            className="relative px-4 py-1.5 rounded-full font-bold transition-transform hover:scale-105 mt-4"
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
      </div>
    </header>
  );
};

export default Header;
