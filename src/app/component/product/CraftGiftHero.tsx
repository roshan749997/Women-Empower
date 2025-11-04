"use client";
import React, { useState, useEffect } from "react";

const CraftGiftHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textCycle, setTextCycle] = useState(0);
  const [particles, setParticles] = useState<
    { left: string; top: string; delay: string; duration: string }[]
  >([]);

  const textVariants = [
    "Give the Gift of Craft",
    "Share Creative Joy",
    "Inspire Artistic Dreams",
  ];

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setTextCycle((prev) => (prev + 1) % textVariants.length);
    }, 4000);

    const newParticles = [...Array(3)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${4 + Math.random() * 2}s`,
    }));
    setParticles(newParticles);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[300px] max-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Scale Animation */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105 animate-zoom"
        style={{
          backgroundImage: "url('/images/green-diwali.jpg')",
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <h1
          key={textCycle}
          className={`text-xl sm:text-2xl md:text-3xl font-bold text-white transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ fontFamily: "Georgia, serif" }}
        >
          {textVariants[textCycle]}
        </h1>

        <p
          className={`mt-3 text-sm sm:text-base text-gray-200 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Create memories that last forever
        </p>

        <button
          className={`mt-6 px-5 py-2 sm:px-6 sm:py-2.5 bg-[#61503c] text-white font-medium text-sm sm:text-base rounded-md shadow-md hover:bg-[#4e3f31] hover:shadow-lg hover:scale-105 transition-all duration-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Purchase Now
        </button>
      </div>

      {/* floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float opacity-40"
            style={{
              backgroundColor: "#fff",
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        /* Background Image Zoom Animation */
        @keyframes zoom {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-zoom {
          animation: zoom 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CraftGiftHero;
