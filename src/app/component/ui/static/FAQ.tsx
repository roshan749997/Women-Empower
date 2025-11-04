"use client";
import React, { useState } from "react";
import faqsData from "@/app/data/faqsData";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  items?: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({
  title = "Frequently Asked Questions",
  items = faqsData, // default data
}) => {
  const [openItem, setOpenItem] = useState<number>(items[0]?.id || 0);

  const toggleItem = (id: number) => {
    setOpenItem((prev) => (prev === id ? 0 : id));
  };

  const isOpen = (id: number) => openItem === id;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
          <div className="w-16 h-1 bg-[#61503c] mx-auto rounded-full"></div>
        </header>

        {/* FAQs */}
        <div className="space-y-4">
          {items.map((faq) => (
            <article
              key={faq.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between bg-gray-50 focus:outline-none"
                aria-expanded={isOpen(faq.id)}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <h2 className="text-lg font-semibold text-gray-800 pr-4">
                  {faq.question}
                </h2>
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isOpen(faq.id) ? "rotate-45" : ""
                    }`}
                  >
                    <span className="text-[#61503c] font-bold text-xl">+</span>
                  </div>
                </div>
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen(faq.id) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            Still have questions?
            <a
              href="/contact"
              className="text-[#61503c] font-medium ml-1 underline"
            >
              Contact us
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
};

export default FAQ;