import React from 'react';

export const StorySection: React.FC = () => {
  return (
    <section id="histoire" className="py-20 md:py-28 relative bg-[#f7f3eb]/60 border-y border-[#1a1a1a]/10">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-9">
        
        {/* Gallery Badge Accent */}
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-[#d4a373]/60"></span>
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#d4a373] font-semibold">
            Notre Histoire · Chapitre I
          </span>
          <span className="w-8 h-[1px] bg-[#d4a373]/60"></span>
        </div>

        {/* Grand Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1a1a1a] font-bold tracking-tight leading-snug">
          « Ce qui compte <span className="italic font-light text-[#d4a373]">commence ici</span>. »
        </h2>

        {/* Narrative editorial text */}
        <div className="space-y-6 text-[#1a1a1a]/80 font-serif text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
          <p>
            Nous avons choisi l&apos;automne pour sa lumière dorée singulière, la chaleur de ses teintes ambrées et la douceur paisible qui s&apos;installe au cœur de la Provence.
          </p>
          <p className="text-sm sm:text-base font-sans font-normal text-[#1a1a1a]/70 leading-relaxed max-w-2xl mx-auto">
            C&apos;est dans ce cadre intime, entourés de notre famille et de nos plus proches amis, que nous scellerons notre union. Votre présence à nos côtés donnera tout son sens à cette journée inoubliable.
          </p>
          <p className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#d4a373] pt-2">
            Chaque invité est convié à retirer son carton d&apos;invitation personnalisé ci-dessous.
          </p>
        </div>

        {/* Minimalist divider */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <div className="h-[1px] w-12 bg-[#1a1a1a]/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373]" />
          <div className="h-[1px] w-12 bg-[#1a1a1a]/15" />
        </div>

      </div>
    </section>
  );
};

