'use client';
import React from 'react';

const MapSection = () => {
  return (
    <section className="w-full h-72 md:h-96">
      <iframe
        title="Jalaram Trading Company Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.098302673689!2d75.73620421501842!3d18.86083348789082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2f4d6f69ae4c7%3A0x7ea9474d5a7b789d!2sJalaram%20Trading%20Company!5e0!3m2!1sen!2sin!4v1694716150117!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  );
};

export default MapSection;
