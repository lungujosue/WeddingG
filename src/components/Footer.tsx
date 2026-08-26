import React from 'react';
import { Heart, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#1a1a1a] text-[#fdfbf7] py-16 px-6 sm:px-10 border-t border-[#1a1a1a] relative overflow-hidden">
      
      {/* Decorative subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4a373_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Monogram Seal */}
        <div className="w-12 h-12 mx-auto rounded-full border border-[#d4a373]/60 bg-[#1a1a1a] flex items-center justify-center">
          <span className="font-serif italic text-lg text-[#d4a373] font-bold">
            É·G
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h3 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] tracking-tight font-black">
            Élodie <span className="italic text-[#d4a373] font-light">&amp;</span> Gabriel
          </h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4a373] font-sans font-semibold">
            12 Octobre 2026 · Provence
          </p>
        </div>

        {/* Poetic quote */}
        <p className="font-serif italic text-base sm:text-lg text-[#fdfbf7]/80 max-w-xl mx-auto leading-relaxed">
          « Nous avons hâte de célébrer ce moment précieux et inoubliable avec vous. »
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-[1px] w-12 bg-[#d4a373]/40" />
          <Heart className="w-3.5 h-3.5 text-[#d4a373] fill-[#d4a373]/30" />
          <div className="h-[1px] w-12 bg-[#d4a373]/40" />
        </div>

        {/* Copyright & Admin Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#fdfbf7]/50 pt-4 border-t border-white/10 gap-3 font-sans">
          <p className="text-[11px]">
            © 2026 Mariage Élodie &amp; Gabriel. Tous droits réservés.
          </p>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-xs text-[#d4a373] hover:text-[#fdfbf7] transition-colors cursor-pointer font-medium uppercase tracking-wider text-[10px]"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Accès Registre Mariage (Admin)</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
