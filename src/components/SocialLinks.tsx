
import { Youtube, Instagram, Facebook, Twitter } from "lucide-react";

const socials = [
  { name: "YouTube", url: "https://www.youtube.com/@gajendrapurohit", icon: Youtube, color: "#FF0000" },
  { name: "Instagram", url: "https://www.instagram.com/dr.gajendrapurohit/", icon: Instagram, color: "#C13584" },
  { name: "Facebook", url: "https://www.facebook.com/drgpsir", icon: Facebook, color: "#1877F3" },
  { name: "X", url: "https://x.com/gpsirofficial", icon: Twitter, color: "#1DA1F2" },
];

const SocialLinks = () => (
  <section id="socials" className="py-10 bg-muted/20">
    <div className="container mx-auto px-6 flex flex-col items-center">
      <h3 className="text-2xl font-semibold mb-4">Find Me On Socials</h3>
      <div className="flex gap-6">
        {socials.map(({ name, url, icon: Icon, color }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-muted bg-card p-4 hover:shadow-lg transition group"
            aria-label={name}
            style={{ color }}
          >
            <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default SocialLinks;
