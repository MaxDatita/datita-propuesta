'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 w-full px-6 py-4 lg:px-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <span className="text-xl font-bold text-gray-900">IntelliAgency</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#servicios" className="text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
            SERVICIOS
          </a>
          <a href="#soluciones" className="text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
            SOLUCIONES
          </a>
          <a href="#casos" className="text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
            CASOS DE ÉXITO
          </a>
          <a href="#blog" className="text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
            BLOG
          </a>
          <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
            DOCS
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            CONTACTAR
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            <a href="#servicios" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
              SERVICIOS
            </a>
            <a href="#soluciones" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
              SOLUCIONES
            </a>
            <a href="#casos" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
              CASOS DE ÉXITO
            </a>
            <a href="#blog" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
              BLOG
            </a>
            <a href="#docs" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium uppercase tracking-wide text-sm">
              DOCS
            </a>
            <button className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-4">
              CONTACTAR
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
