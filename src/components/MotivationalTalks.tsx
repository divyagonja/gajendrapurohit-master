import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube } from "lucide-react";

const motivationalTalks = [
  {
    id: 1,
    title: "How to Stay Motivated for Competitive Exams",
    description: "Master the mindset needed to stay motivated throughout your competitive exam preparation journey.",
    image: "/images/182A4172-e1728803050785.jpg",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  },
  {
    id: 2,
    title: "Overcoming Math Anxiety",
    description: "Learn practical strategies to overcome math anxiety and build confidence in solving complex mathematical problems.",
    image: "/images/182A4172-e1728803050785.jpg",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  },
  {
    id: 3,
    title: "Success Mindset for Students",
    description: "Develop the growth mindset that will help you achieve academic excellence and succeed in your educational journey.",
    image: "/images/182A4172-e1728803050785.jpg",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  },
  {
    id: 4,
    title: "Effective Study Strategies",
    description: "Discover research-backed study techniques that will maximize your learning efficiency and retention.",
    image: "/images/logos/National_Institute_of_Technology,_Patna_Logo.png",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  }
];

const MotivationalTalks = () => {
  return (
    <section id="motivational-talks" className="py-16 bg-muted/20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Motivational Talks</h2>
        
        <div className="bg-primary/5 dark:bg-slate-800 border border-primary/20 rounded-lg py-4 px-6 mb-12 mx-auto max-w-3xl shadow-md">
          <p className="text-center text-foreground dark:text-white text-lg font-medium leading-relaxed">
            Get inspired by <span className="font-bold text-primary dark:text-blue-300">Dr. Gajendra Purohit's</span> motivational talks that help students overcome challenges and achieve academic excellence.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {motivationalTalks.map((talk) => (
            <Card key={talk.id} className="h-full">
              <div className="h-36 overflow-hidden">
                <img
                  src={talk.image}
                  alt={talk.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{talk.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-muted-foreground text-xs">{talk.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={talk.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <span>Watch on YouTube</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <a 
              href="https://www.youtube.com/@gajendrapurohit/playlists" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Youtube className="h-5 w-5" />
              <span>View More Motivational Talks</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MotivationalTalks; 