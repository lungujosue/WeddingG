import React, { useState, useEffect } from 'react';
import { Lock, Menu, X, Heart } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, isAdminLoggedIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#fdfbf7]/95 backdrop-blur-md py-3.5 border-b border-[#1a1a1a]/10 shadow-xs'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Monogram & Avant-Garde Editorial Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3.5 text-left group cursor-pointer"
          aria-label="Retour en haut"
        >
          <div className="w-9 h-9 rounded-full border border-[#1a1a1a] bg-[#fdfbf7] flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
            <span className="font-serif italic text-xs font-bold tracking-widest text-[#1a1a1a] group-hover:text-[#fdfbf7]">
              ÉG
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif font-bold tracking-tighter uppercase italic text-[#1a1a1a]">
              Élodie &amp; Gabriel
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-sans font-medium text-[#d4a373] -mt-1">
              12 Octobre 2026 · Provence
            </div>
          </div>
        </button>

        {/* Artistic Flair Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-9 font-sans text-[10px] uppercase tracking-[0.2em] font-medium text-[#1a1a1a]">
          <button
            onClick={() => scrollToSection('histoire')}
            className="opacity-70 hover:opacity-100 hover:text-[#d4a373] transition-all cursor-pointer py-1"
          >
            Histoire
          </button>
          <button
            onClick={() => scrollToSection('rendez-vous')}
            className="opacity-70 hover:opacity-100 hover:text-[#d4a373] transition-all cursor-pointer py-1"
          >
            Le Rendez-vous
          </button>
          <button
            onClick={() => scrollToSection('invitation')}
            className="opacity-70 hover:opacity-100 hover:text-[#d4a373] transition-all cursor-pointer py-1"
          >
            Invitation
          </button>
          <button
            onClick={() => scrollToSection('invitation')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] text-[#fdfbf7] hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer shadow-xs"
          >
            <Heart className="w-3 h-3 text-[#d4a373] group-hover:text-[#1a1a1a]" />
            RSVP
          </button>
        </nav>

        {/* Admin Link & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            id="header-admin-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-sans font-medium text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-sm transition-colors border border-[#1a1a1a]/15"
            title="Espace Administrateur"
            aria-label="Accéder à l'espace administrateur"
          >
            <Lock className="w-3 h-3 text-[#d4a373]" />
            <span className="hidden sm:inline">
              {isAdminLoggedIn ? 'Admin' : 'Accès Admin'}
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1a1a1a] hover:text-[#d4a373] transition-colors focus:outline-hidden"
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fdfbf7] border-b border-[#1a1a1a]/10 px-6 py-6 space-y-4 shadow-lg animate-in fade-in">
          <button
            onClick={() => scrollToSection('histoire')}
            className="block w-full text-left font-serif text-lg font-bold tracking-tight text-[#1a1a1a] hover:text-[#d4a373] py-1"
          >
            Histoire
          </button>
          <button
            onClick={() => scrollToSection('rendez-vous')}
            className="block w-full text-left font-serif text-lg font-bold tracking-tight text-[#1a1a1a] hover:text-[#d4a373] py-1"
          >
            Le Rendez-vous
          </button>
          <button
            onClick={() => scrollToSection('invitation')}
            className="block w-full text-left font-serif text-lg font-bold tracking-tight text-[#1a1a1a] hover:text-[#d4a373] py-1"
          >
            Votre Invitation & RSVP
          </button>
          <div className="pt-2 border-t border-[#1a1a1a]/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans text-[#1a1a1a]/70 py-1"
            >
              <Lock className="w-3.5 h-3.5 text-[#d4a373]" />
              Espace Administrateur
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
