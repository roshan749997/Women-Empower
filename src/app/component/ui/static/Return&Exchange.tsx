"use client";
import React from "react";

interface PolicyItem {
  text: string;
}

interface ReturnExchangePolicyProps {
  title?: string;
  subtitle?: string;
  policyItems?: PolicyItem[];
  noteTitle?: string;
  noteContent?: string;
  companyName?: string;
}

const ReturnExchangePolicy: React.FC<ReturnExchangePolicyProps> = ({
  title = "Return & Exchange Policy",
  subtitle = "We want you to love your purchase. Still, if you receive a damaged product, we are happy to exchange it.",
  policyItems = [
    {
      text: "Please share clear photos and videos of the damage within 48 hours of delivery.",
    },
    { text: "Return the product to the address provided by our team." },
    {
      text: "Once we receive and verify it, we'll send you a replacement of the same design/product.",
    },
    {
      text: "Customized products and items damaged due to mishandling are not eligible for exchange.",
    },
  ],
  noteTitle = "Note",
  noteContent = "By shopping with Woman.EJ, you agree to these policies. We may update them as needed to serve you better.",
  companyName = "Woman.EJ",
}) => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {title}
          </h1>
          <div className="w-16 h-1 bg-[#61503c] mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </header>

        {/* Card */}
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Policy Steps */}
          <section className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Exchange Process
            </h2>
            <div className="space-y-5">
              {policyItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#f3f3f3] flex-shrink-0 text-[#61503c] rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Note */}
          <section className="p-8 bg-gray-50">
            <div className="bg-white rounded-lg p-6 border-l-4 border-[#61503c] shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-[#f3f3f3] flex-shrink-0 text-[#61503c] rounded-full flex items-center justify-center text-sm font-bold mr-2">
                  !
                </span>
                {noteTitle}
              </h3>
              <p className="text-gray-700">{noteContent}</p>
            </div>
          </section>
        </article>

        {/* Contact */}
        <footer className="text-center mt-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Need Help?
            </h4>
            <p className="text-gray-600 mb-4">
              Have questions about our return and exchange policy?
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
              <a
                href="/contact"
                className="bg-[#817363] hover:bg-[#61503c] text-white transition-colors font-medium px-6 py-3 rounded-lg  shadow-sm"
              >
                Contact Support
              </a>
              <a
                href="/faq"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                View FAQs
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default ReturnExchangePolicy;
