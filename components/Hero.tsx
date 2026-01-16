// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Classical hero component with two columns on desktop and one column on smaller devices
// *********************

import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full bg-blue-950 min-h-[800px] h-auto overflow-hidden">
      {/* Subtle Background Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-800 to-green-950 opacity-90" />

      <div className="relative z-10 grid grid-cols-2 items-center justify-items-center px-6 md:px-10 gap-x-10 max-w-screen-2xl mx-auto h-full py-20 max-lg:grid-cols-1 max-lg:gap-y-16">
        <div className="flex flex-col gap-y-8 max-lg:order-last max-lg:items-center max-lg:text-center">
          <div className="space-y-4">
            <span className="text-green-200 tracking-[0.3em] font-medium text-sm md:text-base uppercase">
              Current Collection
            </span>
            <h1 className="text-7xl text-white font-light tracking-tight leading-tight max-xl:text-6xl max-md:text-5xl max-sm:text-4xl">
              CLOVER <br />
              <span className="font-bold italic">COLLECTION</span>
            </h1>
          </div>

          <p className="text-green-100 text-lg max-w-lg leading-relaxed font-light max-sm:text-sm">
            Discover the perfect harmony of form and function.
          </p>

          <div className="flex gap-x-6 pt-4">
            <button className="bg-white text-green-950 font-semibold px-10 py-4 tracking-widest text-sm hover:bg-green-50 transition-colors uppercase">
              Shop Now
            </button>
            <button className="border border-green-400 text-white font-medium px-10 py-4 tracking-widest text-sm hover:border-white hover:bg-white/10 transition-all uppercase">
              View Lookbook
            </button>
          </div>
        </div>

        <div className="relative flex justify-center items-center w-full h-full">
          {/* Decorative circle */}
          <div className="absolute w-[500px] h-[500px] border border-green-800/40 rounded-full opacity-60 max-md:w-[350px] max-md:h-[350px]" />
          <div className="absolute w-[400px] h-[400px] border border-green-700/40 rounded-full opacity-80 max-md:w-[280px] max-md:h-[280px]" />

          <Image
            src="/watch for banner.png"
            width={600}
            height={600}
            alt="smart watch"
            className="max-md:w-[400px] max-md:h-[400px] max-sm:h-[300px] max-sm:w-[300px] w-auto h-auto drop-shadow-2xl relative z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
