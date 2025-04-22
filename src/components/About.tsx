import { Card } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

const About = () => {
  return (
    <section 
      id="about"
      className="py-20 md:py-32"
    >
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <h2 className="section-title text-center mb-16">About Me</h2>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection delay={400} className="space-y-6 md:col-span-2">
            <h3 className="text-2xl font-bold">Hi, I'm Gajendra Purohit</h3>
            <p className="text-muted-foreground">
            I'm Known as GP Sir (M.Sc., NET, PhD (Pure Mathematics)) across the Udaipur, Rajasthan has excellent 20-year Teaching Experience in Mathematics. He has been imparting quality education to engineering & Basic Science Students (B.Tech./B.Sc./M.Sc./GATE/CSIR NET/ IIT-JAM/ IIT-JEE) with his teaching practices and commitment to excellence. 

Gajendra Purohit comes with videos on Higher Mathematics, Short tricks, Motivation, etc for Engineering, BSc, MSc students and competitive exams.

The tradition of innovation and excellence continues with this YouTube channel of Mathematics initiated by Dr Gajendra Purohit for all CS ,IT, Mechanical, EEE, EC, Electrical and Civil Engineering as well as other competitive exams covering Engineering Mathematics, Short Tricks, General Aptitude, Motivation, etc.

Dr Purohit is also a well known educator for CSIR NET, IIT JAM & GATE, he has his own mobile application named MathsCare and a renowned author of 6 best-selling books on IIT JAM & CSIR NET.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Card className="p-4 hover-card">
                <h4 className="font-bold text-lg">Experience</h4>
                <p className="text-muted-foreground">20+ </p>
              </Card>
              <Card className="p-4 hover-card">
                <h4 className="font-bold text-lg">Education</h4>
                <p className="text-muted-foreground">Degree in B.Sc, M.Sc, B.Tech, M.Tech, GATE, IIT JAM, CSIR NET, CUET PG, SET EXAMS, Other Competitive Exams</p>
              </Card>
              <Card className="p-4 hover-card">
                <h4 className="font-bold text-lg">Location</h4>
                <p className="text-muted-foreground">Udaipur, Rajasthan, India</p>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default About;

