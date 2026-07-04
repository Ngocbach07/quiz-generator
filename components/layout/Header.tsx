'use client';

import { useTranslation } from 'react-i18next';
import { Brain, Globe, Moon, Sun, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/app/providers';

export default function Header() {
  const { i18n, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLang = () => {
    const next = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quiz-lang', next);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass glass-border border-b">
        <div className="container flex h-16 items-center gap-3 px-4">
          <a href="#" className="group flex items-center gap-2.5">
            <span className="relative grid size-9 place-items-center rounded-xl brand-gradient shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <Brain className="size-5 text-white" />
              <span className="absolute inset-0 rounded-xl bg-primary/30 blur-xl -z-10" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              <span className="brand-text">{t('appName')}</span>
            </span>
          </a>

          <nav className="ml-auto flex items-center gap-1.5">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-muted/40 px-3 py-1 text-xs text-muted-foreground mr-2">
              <Sparkles className="size-3.5 text-primary" />
              {t('appName') === 'QuizHub' ? 'AI Generator' : 'Trình tạo AI'}
            </span>
            <Button variant="ghost" size="sm" onClick={toggleLang} aria-label="Toggle language">
              <Globe className="size-4" />
              <span className="text-xs font-medium hidden sm:inline">
                {i18n.language === 'vi' ? 'EN' : 'VI'}
              </span>
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <a href="#features" aria-label="Quiz Generator" className="text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="size-4" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
