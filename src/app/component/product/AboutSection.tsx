"use client";
import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-5 bg-white rounded-sm ">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Namrta Gupta Section */}
          <section className="py-6 px-6 md:px-6 bg-gradient-to-br from-[#7A5C3D]/5 to-[#5C452B]/10 text-[#5C452B] font-sans rounded-xl">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Woman Empowering Journey{" "}
                  <span className="text-[#7A5C3D]">(WEJ)</span>
                </h2>
                <p className="text-lg text-[#5C452B]/80 max-w-3xl mx-auto">
                  Founded by{" "}
                  <span className="font-semibold text-[#7A5C3D]">
                    Namrta Gupta
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Image */}
                <div className="order-2 lg:order-1">
                  <div className="relative w-full h-80 lg:h-96 overflow-hidden rounded-xl shadow-lg bg-white">
                    <Image
                      src="/images/rangoli11.jpg"
                      alt="Sonali Thaakkar WEJ"
                      width={700}
                      height={450}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="order-1 lg:order-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-[#7A5C3D]">
                      Traditional Artistry
                    </h3>
                    <p className="text-sm md:text-base text-[#5C452B]/90 leading-relaxed">
                      We promote Indian traditional art through decorative
                      Kundan items, celebrating culture and craftsmanship with
                      timeless beauty.
                    </p>
                  </div>

                  <div className="bg-white/70 p-5 rounded-lg">
                    <h4 className="font-bold text-[#7A5C3D] mb-2">
                      Our Commitment
                    </h4>
                    <p className="text-sm md:text-base text-[#5C452B]/90 leading-relaxed">
                      Each piece is handcrafted with care, blending heritage and
                      modernity. By choosing us, you beautify your spaces and
                      support artisans who keep traditions alive.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sonalli Thaakkar & WEJ Section */}
          <section className="py-6 px-6 md:px-6 bg-gradient-to-br from-[#7A5C3D]/5 to-[#5C452B]/10 text-[#5C452B] font-sans rounded-xl">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Woman Empowering Journey{" "}
                  <span className="text-[#7A5C3D]">(WEJ)</span>
                </h2>
                <p className="text-lg text-[#5C452B]/80 max-w-3xl mx-auto">
                  Founded by{" "}
                  <span className="font-semibold text-[#7A5C3D]">
                    Sonali Thakkar 
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Static Image */}
                <div className="order-2 lg:order-1">
                  <div className="relative w-full h-80 lg:h-96 overflow-hidden rounded-xl shadow-lg bg-white">
                    <Image
                      src="/images/sonali.jpeg"
                      alt="Sonali Thaakkar WEJ"
                      width={700}
                      height={450}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="order-1 lg:order-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-[#7A5C3D]">
                      The Journey Begins
                    </h3>
                    <p className="text-sm md:text-base text-[#5C452B]/90 leading-relaxed">
                      Sometimes we choose the path, and sometimes the path
                      chooses us. Sonali Thakkar is one of the fortunate few
                      who never let her journey pause and transformed it into a
                      new identity.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm md:text-base text-[#5C452B]/90 leading-relaxed">
                      For her, art and creativity are not just hobbies—they are
                      powerful forces that open doors to new dreams and endless
                      opportunities.
                    </p>
                  </div>

                  <div className="bg-white/70 p-5 rounded-lg">
                    <h4 className="font-bold text-[#7A5C3D] mb-2">About WEJ</h4>
                    <p className="text-sm md:text-base text-[#5C452B]/90 leading-relaxed">
                      From this passion was born Woman Empowering Journey (WEJ)
                      – a platform dedicated to financially, emotionally, and
                      mentally empowering women. Here, every woman discovers her
                      identity, turns her dreams into reality, and shares her
                      story with the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vision & Mission Section */}
          <section className="py-6 px-6 md:px-12 bg-white text-[#5C452B] font-sans rounded-xl">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-5">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center">
                  <span className="text-2xl mr-3">🌟</span>
                  Our <span className="text-[#7A5C3D] ml-2">Vision</span>
                </h2>
                <div className="bg-gradient-to-r from-[#7A5C3D]/10 to-[#5C452B]/10 p-4 rounded-xl">
                  <p className="text-lg md:text-xl text-[#5C452B] leading-relaxed font-medium">
                    "For every woman to recognize her strength, write her own
                    journey, and transform her dreams into reality."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#7A5C3D]/5 p-4 rounded-xl">
                  <h3 className="text-lg font-bold mb-3 text-[#7A5C3D]">
                    The Experience
                  </h3>
                  <p className="text-sm md:text-base text-[#5C452B]/90 leading-relaxed">
                    "Joining WEJ isn't just attending a workshop—it's the
                    beginning of a new identity—one that makes you not only
                    skilled but truly unstoppable."
                  </p>
                </div>

                <div className="bg-[#5C452B]/5 p-4 rounded-xl">
                  <h3 className="text-lg font-bold mb-3 text-[#7A5C3D] flex items-center">
                    <span className="text-xl mr-2">🔥</span>
                    The Revolution
                  </h3>
                  <p className="text-sm md:text-base text-[#5C452B]/90 leading-relaxed">
                    "WEJ – Empowering women is not just a mission; it's a
                    revolution."
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
