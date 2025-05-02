import { Youtube } from "lucide-react";

const channels = [
  {
    name: "Dr.Gajendra Purohit",
    url: "https://www.youtube.com/@gajendrapurohit",
    channelId: "UCrn5dP-L8x5Yf6BpQKAgu6Q",
    description: "1.63M Subscribers",
    image: "https://yt3.googleusercontent.com/jZxMN-zI0AolSc4aGHSjkU74KK_4Im2d5RDGHXqw2DbvkMnZ8dLClL0C7nSB7u-EbjJroSFvVek=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Dr.Gajendra Purohit - GATE / IIT JAM / CSIR NET",
    url: "https://www.youtube.com/@gajendrapurohit-GATE-NET-JAM",
    channelId: "UCswyBZpLc8_i74nNuJv_9Bw",
    description: "399K+ Subscribers",
    image: "https://yt3.googleusercontent.com/1XCOjz9zzcZMH42YoUKjQKpVCkbkjN-1j-SgVN9Ahwa64p_jK9rC8DZjUyIPhTY8iCkAHh9A=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Dr.Gajendra Purohit GATE Exam Prep",
    url: "https://www.youtube.com/@gajendrapurohit-ExamPrep",
    channelId: "UCU6ULFBYpvJeQkBFaqyLvwQ",
    description: "38K+ Subscribers",
    image: "https://yt3.googleusercontent.com/LaOt59bWe-D-mhe_yZ2mStBtf4xku92SquKSF52muDOr8nemczlCyCJnGdhAydTqBL2u4q8FiA=s160-c-k-c0x00ffffff-no-rj",
  },
];

const FeaturedChannels = () => {
  return (
    <section id="channels" className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-center mb-8">Featured YouTube Channels</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {channels.map((ch, idx) => (
            <div
              key={ch.name}
              className="rounded-xl bg-card p-6 flex flex-col items-center text-center animate-fade-in h-full hover:shadow-xl hover:scale-105 hover:bg-card/90 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <img
                src={ch.image}
                alt={ch.name}
                className="w-14 h-14 mb-4 rounded-full transition-transform duration-300 hover:scale-110"
              />
              <h3 className="text-lg font-bold mb-2 text-foreground">{ch.name}</h3>
              <p className="text-muted-foreground mb-3">{ch.description}</p>
              <div className="mt-auto pt-4">
                <a
                  href={`https://www.youtube.com/channel/${ch.channelId}?sub_confirmation=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#c00] hover:bg-[#990000] text-white text-sm font-medium px-4 py-2 rounded transition-all duration-200 hover:scale-105"
                >
                  <Youtube size={18} />
                  SUBSCRIBE
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedChannels;


