
import { useInView } from "react-intersection-observer";

type TextRevealProps = {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
};

const TextReveal = ({ children, delay = 0, threshold = 0.1 }: TextRevealProps) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return (
    <div className="reveal-container">
      <span
        ref={ref}
        className={`reveal-text ${inView ? "revealed" : ""}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </div>
  );
};

export default TextReveal;
