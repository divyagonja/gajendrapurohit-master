
import { Youtube } from "lucide-react";

const channels = [
  {
    name: "Dr.Gajendra Purohit",
    url: "https://www.youtube.com/@gajendrapurohit",
    description: "1.63M Subscribers",
    image: "https://yt3.googleusercontent.com/jZxMN-zI0AolSc4aGHSjkU74KK_4Im2d5RDGHXqw2DbvkMnZ8dLClL0C7nSB7u-EbjJroSFvVek=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Dr.Gajendra Purohit - GATE / IIT JAM / CSIR NET",
    url: "https://www.youtube.com/@gajendrapurohit-GATE-NET-JAM",
    description: "399K+ Subscribers",
    image: "https://yt3.googleusercontent.com/1XCOjz9zzcZMH42YoUKjQKpVCkbkjN-1j-SgVN9Ahwa64p_jK9rC8DZjUyIPhTY8iCkAHh9A=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Dr.Gajendra Purohit GATE Exam Prep",
    url: "https://www.youtube.com/@gajendrapurohit-ExamPrep",
    description: "38K+ Subscribers",
    image: "https://yt3.googleusercontent.com/LaOt59bWe-D-mhe_yZ2mStBtf4xku92SquKSF52muDOr8nemczlCyCJnGdhAydTqBL2u4q8FiA=s160-c-k-c0x00ffffff-no-rj",
  },
];

const FeaturedChannels = () => (
  <section id="channels" className="py-16 bg-background">
    <div className="container mx-auto px-6">
      <h2 className="section-title text-center mb-8">Featured YouTube Channels</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {channels.map((ch, idx) => (
          <a
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            key={ch.name}
            className="group hover:shadow-lg transition-all rounded-xl bg-card p-6 flex flex-col items-center text-center animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <img
              src={ch.image}
              alt={ch.name}
              className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform"
            />
            <h3 className="text-lg font-bold mb-2">{ch.name}</h3>
            <p className="text-muted-foreground">{ch.description}</p>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedChannels;


