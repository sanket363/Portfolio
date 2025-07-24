"use client";
import React from "react";

const ContactForm = () => {
  return (
    <section className="py-16 bg-gray-950 text-white">
      <div className="container mx-auto px-6 max-w-lg">
        <h2 className="text-3xl font-bold mb-6 font-mono text-blue-400">Contact Me</h2>
        <form className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none" type="text" placeholder="Your Name" required />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none" type="email" placeholder="you@email.com" required />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Message</label>
            <textarea className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none" rows={5} placeholder="How can I help you?" required></textarea>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold transition">Send</button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
