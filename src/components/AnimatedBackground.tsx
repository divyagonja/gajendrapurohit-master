
import React from "react";

const shapeConfigs = [
  {
    style: "absolute left-10 top-10 w-32 h-32 bg-gradient-to-tr from-[#f6d365] via-[#fda085] to-[#ff99ac] blur-2xl opacity-60 animate-float-slow rounded-full",
    duration: "7s",
    delay: "0s"
  },
  {
    style: "absolute right-20 top-1/3 w-40 h-40 bg-gradient-to-br from-[#cfecd0] via-[#a0cea7] to-[#5eaaa8] blur-2xl opacity-40 animate-float-medium rounded-full",
    duration: "10s",
    delay: "1.5s"
  },
  {
    style: "absolute left-1/4 bottom-20 w-28 h-28 bg-gradient-to-br from-[#a6c1ee] via-[#fbc2eb] to-[#fad0c4] blur-3xl opacity-70 animate-float-fast rounded-full",
    duration: "5s",
    delay: "0.6s"
  },
  {
    style: "absolute right-16 bottom-14 w-24 h-24 bg-gradient-to-tl from-[#f2fcfe] via-[#1c92d2] to-[#1a2980] blur-2xl opacity-30 animate-float-slower rounded-full",
    duration: "12s",
    delay: "2.1s"
  }
];

const AnimatedBackground = () => (
  <div className="pointer-events-none absolute inset-0 -z-10">
    {shapeConfigs.map((cfg, i) => (
      <div
        key={i}
        className={cfg.style}
        style={{
          animationDuration: cfg.duration,
          animationDelay: cfg.delay as string
        }}
      />
    ))}
  </div>
);

export default AnimatedBackground;
