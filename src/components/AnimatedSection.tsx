
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  animation?: "fade-in" | "scale-in" | "text-reveal";
  once?: boolean;
};

const AnimatedSection = ({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  animation = "fade-in",
  once = true,
}: AnimatedSectionProps) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once,
  });

  return (
    <div
      ref={ref}
      className={cn(
        className,
        inView ? `animate-${animation}` : "opacity-0",
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
