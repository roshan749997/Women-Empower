"use client";

import React from "react";
import {
  WarningAmber,
  VideoLibrary,
  CheckCircle,
  CreditCard,
} from "@mui/icons-material";

const TermsConditionsPage: React.FC = () => {
  const terms = [
    {
      id: 1,
      icon: <WarningAmber fontSize="large" className="text-yellow-500" />,
      title: "Workshop and Competition Fees",
      description:
        "All workshop and competition fees are non-refundable. Please register mindfully and ensure you can attend before making payment.",
      details:
        "Once payment is processed, no refunds will be issued under any circumstances. This policy helps us maintain quality programming and fair pricing for all participants.",
    },
    {
      id: 2,
      icon: <VideoLibrary fontSize="large" className="text-blue-500" />,
      title: "Recordings Access",
      description:
        "Recordings (if provided) will have limited-time access and are strictly for personal use only.",
      details:
        "Recording access typically expires 30 days after the event. Sharing, distributing, or commercial use of recordings is strictly prohibited and may result in legal action.",
    },
    {
      id: 3,
      icon: <CheckCircle fontSize="large" className="text-green-500" />,
      title: "Handcrafted Art Products",
      description:
        "All art products are handcrafted with care, so little variations in color and design are natural and expected.",
      details:
        "Each piece is unique due to the handmade nature. Minor variations in color, texture, or design elements are not considered defects but rather characteristics that make each item special.",
    },
    {
      id: 4,
      icon: <CreditCard fontSize="large" className="text-purple-500" />,
      title: "Order Processing",
      description:
        "Orders are processed only after full payment confirmation is received.",
      details:
        "Processing begins within 1-2 business days after payment verification. You will receive an email confirmation once your order enters the production queue.",
    },
  ];

  return (
    <div className="min-h-screen text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-600">
              Please read carefully before proceeding
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Terms Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          {terms.map((term) => (
            <article
              key={term.id}
              className="p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              {/* Icon center top */}
              <div className="p-3 rounded-full bg-gray-100 mb-4 flex items-center justify-center">
                {term.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold mb-2">{term.title}</h3>
              <p className="text-gray-700 mb-3">{term.description}</p>
              <div className="text-sm text-gray-600">{term.details}</div>
            </article>
          ))}
        </section>

        {/* Contact Information */}
        <section className="mt-12">
          <div className="p-6 rounded-xl bg-[#f3f3f3] text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Questions or Concerns?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these terms and conditions or need
              clarification on any policy, please don't hesitate to contact our
              support team before making any commitments or purchases.
            </p>
            <div className="mt-4">
              <button  className="px-6 py-2 rounded-lg font-medium bg-[#817363] hover:bg-[#61503c] text-white transition-colors">
                <a href="/contact">Contact Support</a>
              </button>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default TermsConditionsPage;
