import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingControlsProps {
  onOpenChat: () => void;
  isChatOpen: boolean;
}

const FloatingControls = ({ onOpenChat, isChatOpen }: FloatingControlsProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed z-50 bottom-5 right-5 flex flex-col items-center gap-3">
      {/* Chatbot button */}
      <button 
        onClick={onOpenChat} 
        className={`p-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-primary/20 dark:border-primary/30 group overflow-hidden ${isChatOpen ? 'opacity-70' : 'opacity-100'}`}
        aria-label="Open chat assistant"
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <MessageSquareText className="h-6 w-6" />
        </div>
      </button>

      {/* Theme toggle button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 backdrop-blur-md shadow-lg dark:shadow-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-110 border border-primary/20 dark:border-primary/30 group overflow-hidden"
        aria-label="Toggle theme"
      >
        <div className="relative w-6 h-6">
          {/* Sun icon with animation */}
          <Sun 
            className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${
              theme === "dark" 
                ? "rotate-0 scale-100 text-yellow-300" 
                : "rotate-90 scale-0 text-yellow-300"
            }`} 
          />
          
          {/* Moon icon with animation */}
          <Moon 
            className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${
              theme === "light" 
                ? "rotate-0 scale-100 text-slate-700" 
                : "-rotate-90 scale-0 text-slate-700"
            }`} 
          />
        </div>
        
        {/* Background glow effect */}
        <span 
          className={`absolute inset-0 rounded-full transition-all duration-1000 ${
            theme === "dark" 
              ? "bg-gradient-to-r from-yellow-500/10 to-yellow-300/20 opacity-100 blur-xl" 
              : "bg-gradient-to-r from-indigo-500/10 to-indigo-700/20 opacity-100 blur-xl"
          }`}
        />
      </button>
    </div>
  );
};

export default FloatingControls; 