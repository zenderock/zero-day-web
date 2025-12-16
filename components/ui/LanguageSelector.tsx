'use client';

import { useLocale } from '@/lib/locale-context';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export const LanguageSelector = () => {
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-white/20 hover:bg-white/10 hover:border-[#00f3ff] transition-colors"
        title="SELECT_LANGUAGE"
      >
        <Globe className="w-4 h-4 text-white/50" />
        <span className="text-[10px] font-mono text-white/50 uppercase">{locale}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full right-0 mb-2 w-32 bg-black/95 border border-white/20 backdrop-blur-xl z-50">
            <div className="p-2">
              <div className="text-[10px] font-mono text-white/40 tracking-widest mb-2">LANGUAGE</div>
              <button
                onClick={() => {
                  setLocale('en');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                  locale === 'en' 
                    ? 'bg-[#00f3ff]/20 text-[#00f3ff] border-l-2 border-[#00f3ff]' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                ENGLISH
              </button>
              <button
                onClick={() => {
                  setLocale('fr');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                  locale === 'fr' 
                    ? 'bg-[#00f3ff]/20 text-[#00f3ff] border-l-2 border-[#00f3ff]' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                FRANÇAIS
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

