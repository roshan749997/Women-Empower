'use client';
import React, { useState, useEffect } from 'react';

const productImages = [
  {
    id: 1,
    src: "./images/showcase.webp",
    alt: "Abstract Folded Pot Design 1"
  },
  {
    id: 2,
    src: "./images/showcase.webp",
    alt: "Abstract Folded Pot Design 2"
  },
  {
    id: 3,
    src: "./images/showcase.webp",
    alt: "Abstract Folded Pot Design 3"
  }
];

const ProductShowcase: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <div className="bg-white py-6 px-4 rounded-sm ">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg overflow-hidden flex flex-col lg:flex-row items-center">
            
            {/* Image Section */}
            <div className="lg:w-1/2 relative bg-white">
              <div className="relative max-w-md mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={productImages[currentImageIndex].src}
                      alt={productImages[currentImageIndex].alt}
                      className="w-full h-full object-cover transition-transform duration-[4000ms] ease-in-out animate-zoom"
                    />
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center mt-3 space-x-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300  ${
                        index === currentImageIndex 
                          ? 'bg-[#61503c]' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="lg:w-1/2 p-6 flex flex-col justify-center">
              <div className="space-y-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                  Crafting dreams into reality
                </h1>
                
                <p className="text-gray-600 text-base leading-relaxed">
                  "Woman Empowering Journey" ~ Handcrafted by Namrta Gupta. We founded with a vision 
                  to encourage the Indian traditional art in the form of Decorative Kundan Items, 
                  which create the exceptional aura….
                </p>
                
                <div className="pt-3 flex justify-center lg:justify-start">
                  <button className="bg-[#867259eb] hover:bg-[#61503c] text-white px-6 py-2.5 rounded-md font-medium transition-all duration-300 hover:scale-105">
                    View More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Zoom Animation */}
      <style jsx>{`
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
          animation: zoom 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductShowcase;
