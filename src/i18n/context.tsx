import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof translations.en;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem('phootflow-lang');
    if (stored === 'en' || stored === 'es') return stored;
    if (navigator.language.startsWith('es')) return 'es';
  } catch {}
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try { localStorage.setItem('phootflow-lang', next); } catch {}
  }, []);

  const t = translations[lang] as typeof translations.en;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
