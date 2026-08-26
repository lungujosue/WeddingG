import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import weddingPhoto from '../assets/images/wedding_couple_autumn_1787757741072.jpg';

export const Hero: React.FC = () => {
  const handleScrollDown = () => {
    const target = document.getElementById('histoire');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 md:pt-36 md:pb-24 flex items-center overflow-hidden">
      {/* Subtle gallery background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#fdfbf7] via-[#f7f3eb]/70 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Artistic Flair Grand Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col justify-end text-left space-y-6">
            
            {/* Gallery Collection Tag */}
            <div className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#d4a373] font-semibold flex items-center gap-2.5">
              <span className="w-6 h-[1px] bg-[#d4a373]"></span>
              <span>Célébration d&apos;Automne · No. 01</span>
            </div>

            {/* High-Contrast Bold Display Serif Headline */}
            <div>
              <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[5.8rem] leading-[0.88] font-black tracking-tighter text-[#1a1a1a] mb-5">
                ÉLODIE <br/>
                <span className="pl-6 sm:pl-12 italic font-light text-[#d4a373]">ET</span> GABRIEL
              </h1>
              
              {/* Date & Location Line */}
              <div className="flex items-center gap-4 text-xs font-sans uppercase tracking-[0.25em] text-[#1a1a1a]/80 pt-1">
                <span className="font-serif italic font-bold text-base text-[#d4a373] tracking-normal">12 · 10 · 2026</span>
                <span className="text-[#1a1a1a]/30">|</span>
                <span>La Bastide des Oliviers · Provence</span>
              </div>
            </div>

            {/* Narrative Editorial Quote */}
            <p className="font-sans text-sm sm:text-base leading-relaxed max-w-lg text-[#1a1a1a]/70">
              « Deux chemins qui se rejoignent, et une journée d&apos;exception à partager avec ceux qui nous sont chers sous la lumière dorée d&apos;octobre. »
            </p>

            {/* Actions CTA */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                id="hero-invitation-btn"
                onClick={() => {
                  const el = document.getElementById('invitation');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#1a1a1a] text-[#fdfbf7] hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all duration-300 text-xs font-sans font-bold uppercase tracking-[0.2em] cursor-pointer shadow-sm"
              >
                <span>Prendre mon invitation</span>
                <Sparkles className="w-3.5 h-3.5 text-[#d4a373] group-hover:text-[#1a1a1a] transition-colors" />
              </button>

              <button
                id="hero-discover-btn"
                onClick={handleScrollDown}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-[#1a1a1a]/30 text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-colors text-xs font-sans font-semibold uppercase tracking-[0.2em] cursor-pointer"
              >
                <span>Découvrir</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#d4a373]" />
              </button>
            </div>
          </div>

          {/* Right Column: Sculptural & Editorial Photo Composition */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            
            {/* Background Sculptural Rotated Card Accent */}
            <div className="absolute inset-0 bg-[#1a1a1a] rounded-[36px] sm:rounded-[48px] overflow-hidden transform rotate-2 scale-98 pointer-events-none opacity-90 shadow-xl" />

            {/* Main Editorial Photo Frame */}
            <div className="relative p-3.5 sm:p-4 bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded-[32px] sm:rounded-[44px] shadow-2xl overflow-hidden">
              <div className="relative aspect-4/5 overflow-hidden rounded-[24px] sm:rounded-[36px] bg-[#f7f3eb]">
                <img
                  src={weddingPhoto}
                  alt="Élodie et Gabriel dans un jardin d'automne en Provence"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Top corner edition badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#1a1a1a]/80 backdrop-blur-xs text-white rounded-full font-sans text-[9px] uppercase tracking-[0.25em]">
                  Provence · 2026
                </div>

                {/* Bottom caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[9px] uppercase tracking-[0.3em] opacity-80 font-sans">
                    Promesse d&apos;Automne
                  </div>
                  <div className="text-lg font-serif italic">
                    Élodie &amp; Gabriel
                  </div>
                </div>
              </div>
            </div>

            {/* Artistic Flair Circular Stamp Badge */}
            <div className="absolute -bottom-5 -left-5 sm:-bottom-7 sm:-left-7 w-32 h-32 sm:w-36 sm:h-36 bg-[#d4a373] rounded-full flex items-center justify-center border-[6px] border-[#fdfbf7] shadow-xl z-20 hover:scale-105 transition-transform">
              <div className="text-white font-sans text-[10px] font-bold uppercase tracking-widest text-center leading-tight">
                Célébration <br />
                <span className="text-base font-serif italic font-normal my-0.5 block">12 · OCT</span>
                Provence
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
