import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const headerStyles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
  
  @keyframes gradient-move {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
`;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted py-12">
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold">
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
            </div>
            <p className="text-muted-foreground mt-2">
              Learn with Mathscare!
            </p>
          </div>
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-5 w-5" />
              <span className="sr-only">Back to top</span>
            </Button>
          </div>
        </div>
        
        <div className="footer-gradient my-8 h-1 rounded-full animate-gradient-move shadow-lg" 
          style={{
            background: 'linear-gradient(90deg, #ff6b6b, #a18cd1, #fbc2eb, #45caff, #fad0c4, #6a5af9, #ff9a8b)',
            backgroundSize: '300% 300%'
          }}
        />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Dr.Gajendra Purohit All rights reserved. Designed by Divya Gonja
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0 items-center">
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
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
