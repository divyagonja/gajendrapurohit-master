
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const skills = [
  {
    category: "Frontend",
    items: [
      { name: "React.js", level: 90 },
      { name: "JavaScript/TypeScript", level: 85 },
      { name: "HTML/CSS", level: 95 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 80 },
      { name: "Express", level: 75 },
      { name: "MongoDB", level: 70 },
      { name: "SQL", level: 65 },
    ],
  },
  {
    category: "Others",
    items: [
      { name: "Git/GitHub", level: 85 },
      { name: "UI/UX Design", level: 75 },
      { name: "Testing", level: 70 },
      { name: "DevOps", level: 60 },
    ],
  },
];

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0");
            
            // If it's a progress element, animate it
            if (entry.target.classList.contains("progress-item")) {
              const progressElement = entry.target.querySelector("[data-progress]");
              if (progressElement) {
                const targetValue = parseInt(progressElement.getAttribute("data-value") || "0");
                animateProgress(progressElement as HTMLDivElement, targetValue);
              }
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    skillRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    progressRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      skillRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      progressRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  const animateProgress = (element: HTMLDivElement, target: number) => {
    let value = 0;
    const duration = 1500; // Animation duration in ms
    const frameDuration = 16; // ~60fps
    const totalFrames = duration / frameDuration;
    let frame = 0;
    
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = Math.round(progress * target);
      
      if (progress < 1) {
        element.style.width = `${currentValue}%`;
        requestAnimationFrame(animate);
      } else {
        element.style.width = `${target}%`;
      }
    };
    
    requestAnimationFrame(animate);
  };
  
  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 md:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="opacity-0" ref={(el) => (skillRefs.current[0] = el)}>
          <h2 className="section-title text-center mb-16">My Skills</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            I've developed a diverse set of skills throughout my career.
            Here's an overview of my technical expertise.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skillGroup, groupIndex) => (
            <div 
              key={skillGroup.category} 
              className="opacity-0"
              ref={(el) => (skillRefs.current[groupIndex + 1] = el)}
              style={{ transitionDelay: `${(groupIndex + 1) * 100}ms` }}
            >
              <Card className="h-full hover-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-6">{skillGroup.category}</h3>
                  <div className="space-y-6">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <div 
                        key={skill.name}
                        className="progress-item opacity-0"
                        ref={(el) => (progressRefs.current[groupIndex * 4 + skillIndex] = el)}
                        style={{ transitionDelay: `${(groupIndex * 4 + skillIndex) * 100 + 300}ms` }}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            data-progress
                            data-value={skill.level}
                            className="h-full bg-primary rounded-full"
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
