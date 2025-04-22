
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Link } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Project One",
    description: "A full-stack web application built with React and Node.js.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600",
    tags: ["React", "Node.js", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: 2,
    title: "Project Two",
    description: "A responsive e-commerce platform with a modern UI/UX design.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: 3,
    title: "Project Three",
    description: "A mobile application built with React Native for both iOS and Android.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=600",
    tags: ["React Native", "Firebase", "Redux"],
    githubUrl: "#",
    liveUrl: "#",
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      projectRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-20 md:py-32 bg-muted/30"
    >
      <div className="container mx-auto px-6">
        <div className="opacity-0" ref={(el) => (projectRefs.current[0] = el)}>
          <h2 className="section-title text-center mb-16">My Projects</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Here are some of my recent projects. Each one presented unique challenges
            and opportunities for growth.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="opacity-0"
              ref={(el) => (projectRefs.current[index + 1] = el)}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <Card className="h-full hover-card overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Link className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center opacity-0" ref={(el) => (projectRefs.current[4] = el)}>
          <Button variant="outline" size="lg">
            <a href="#" target="_blank" rel="noopener noreferrer">
              View More Projects
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
