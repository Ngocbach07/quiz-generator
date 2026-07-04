'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

type Theme = 'light' | 'dark';
interface ThemeCtx {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('quiz-theme')) as Theme | null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(next);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('quiz-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </ThemeContext.Provider>
  );
}
