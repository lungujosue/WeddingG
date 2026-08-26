import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Shirt, ChevronRight } from 'lucide-react';

export const DetailsSection: React.FC = () => {
  const handleScrollToInvitation = () => {
    const el = document.getElementById('invitation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="rendez-vous" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-[#d4a373]/60" />
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#d4a373] font-semibold">
              Programme &amp; Célébration
            </span>
            <span className="h-[1px] w-8 bg-[#d4a373]/60" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1a1a1a]">
            Le Rendez-vous
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#1a1a1a]/70 max-w-xl mx-auto">
            Toutes les informations pratiques pour vivre ensemble cette parenthèse enchantée en Provence.
          </p>
        </div>

        {/* 4-Card Exhibition / Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Card 1: Date & Cérémonie */}
          <div className="p-8 bg-[#fdfbf7] border border-[#1a1a1a]/10 hover:border-[#d4a373] transition-all rounded-[20px] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full border border-[#1a1a1a]/20 bg-[#f7f3eb] flex items-center justify-center text-[#d4a373]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4a373] font-sans font-semibold">
                  Date
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
                  12 Octobre 2026
                </h3>
              </div>
              <p className="text-xs font-sans text-[#1a1a1a]/70 leading-relaxed">
                Lundi d&apos;automne sous la lumière provençale dorée.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1a1a1a]/10 text-[10px] uppercase tracking-[0.2em] font-sans text-[#1a1a1a]/50">
              Automne 2026
            </div>
          </div>

          {/* Card 2: Heure */}
          <div className="p-8 bg-[#fdfbf7] border border-[#1a1a1a]/10 hover:border-[#d4a373] transition-all rounded-[20px] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full border border-[#1a1a1a]/20 bg-[#f7f3eb] flex items-center justify-center text-[#d4a373]">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4a373] font-sans font-semibold">
                  Horaire
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
                  15h30 précises
                </h3>
              </div>
              <p className="text-xs font-sans text-[#1a1a1a]/70 leading-relaxed">
                Accueil des invités à partir de 15h00, suivi de la bénédiction et du vin d&apos;honneur.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1a1a1a]/10 text-[10px] uppercase tracking-[0.2em] font-sans text-[#1a1a1a]/50">
              Célébration &amp; Réception
            </div>
          </div>

          {/* Card 3: Lieu */}
          <div className="p-8 bg-[#fdfbf7] border border-[#1a1a1a]/10 hover:border-[#d4a373] transition-all rounded-[20px] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full border border-[#1a1a1a]/20 bg-[#f7f3eb] flex items-center justify-center text-[#d4a373]">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4a373] font-sans font-semibold">
                  Le Lieu
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
                  La Bastide des Oliviers
                </h3>
              </div>
              <p className="text-xs font-sans text-[#1a1a1a]/70 leading-relaxed">
                Route des Lavandes, Provence. Parking privé sécurisé disponible sur place.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1a1a1a]/10 text-[10px] uppercase tracking-[0.2em] font-sans text-[#1a1a1a]/50">
              Provence, France
            </div>
          </div>

          {/* Card 4: Tenue (Dress code) */}
          <div className="p-8 bg-[#fdfbf7] border border-[#1a1a1a]/10 hover:border-[#d4a373] transition-all rounded-[20px] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full border border-[#1a1a1a]/20 bg-[#f7f3eb] flex items-center justify-center text-[#d4a373]">
                <Shirt className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4a373] font-sans font-semibold">
                  Code Vestimentaire
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
                  Tenue Élégante
                </h3>
              </div>
              <p className="text-xs font-sans text-[#1a1a1a]/70 leading-relaxed">
                Palette conseillée : Ivoire, champagne, beige chaud ou nuances artistiques d&apos;automne (ambre, terracotta, sauge).
              </p>
            </div>
            <div className="pt-3 border-t border-[#1a1a1a]/10 text-[10px] uppercase tracking-[0.2em] font-sans text-[#1a1a1a]/50">
              Artistic Flair
            </div>
          </div>

        </div>

        {/* CTA Button "Je prépare ma venue" */}
        <div className="mt-14 text-center">
          <button
            id="prepare-venue-btn"
            onClick={handleScrollToInvitation}
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#1a1a1a] text-[#fdfbf7] hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all duration-300 text-xs font-sans font-bold uppercase tracking-[0.2em] cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4a373] group-hover:text-[#1a1a1a]" />
            <span>Je prépare ma venue</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#fdfbf7] group-hover:text-[#1a1a1a] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
