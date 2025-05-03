import { Youtube, Instagram, Facebook } from "lucide-react";

// Custom X (Twitter) icon with more accurate styling to match official X logo
const XIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-x"
    {...props}
  >
    <path 
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" 
      stroke="none" 
      fill="currentColor" 
    />
  </svg>
);

const socials = [
  { name: "YouTube", url: "https://www.youtube.com/@gajendrapurohit", icon: Youtube, color: "#FF0000" },
  { name: "Instagram", url: "https://www.instagram.com/dr.gajendrapurohit/", icon: Instagram, color: "#C13584" },
  { name: "Facebook", url: "https://www.facebook.com/drgpsir", icon: Facebook, color: "#1877F3" },
  { name: "X", url: "https://x.com/gpsirofficial", icon: XIcon, color: "currentColor" },
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
