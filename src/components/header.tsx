"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header id="header" className={`sticky top-0 z-50 ${isScrolled ? 'shadow-md' : ''}`}>
      <nav className={`bg-white transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="font-bold text-2xl text-[#15346a]">AJUDE O MATEUS</Link>

            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className={`md:flex items-center ${isMenuOpen ? 'block absolute top-16 left-0 right-0 bg-white z-50 shadow-md' : 'hidden'} md:static md:shadow-none`}>
              <ul className="md:flex md:space-x-6">
                <li className="py-3 md:py-0 border-b md:border-b-0 border-gray-100">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-[#15346a] block px-4 md:px-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li className="py-3 md:py-0 border-b md:border-b-0 border-gray-100">
                  <Link
                    href="/campanhas"
                    className="text-gray-700 hover:text-[#15346a] block px-4 md:px-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Campanhas
                  </Link>
                </li>
                <li className="py-3 md:py-0 border-b md:border-b-0 border-gray-100">
                  <Link
                    href="/envie-sua-historia"
                    className="text-gray-700 hover:text-[#15346a] block px-4 md:px-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Envie sua história
                  </Link>
                </li>
                <li className="py-3 md:py-0">
                  <Link
                    href="/quem-somos"
                    className="text-gray-700 hover:text-[#15346a] block px-4 md:px-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Quem Somos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}