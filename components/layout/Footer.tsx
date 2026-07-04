'use client';

import { useTranslation } from 'react-i18next';
import { Brain, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-foreground/10 bg-muted/20">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md brand-gradient">
            <Brain className="size-3.5 text-white" />
          </span>
          <span>&copy; {year} QuizHub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Built with</span>
          <Heart className="size-3.5 fill-red-500 text-red-500" />
          <span>· Next.js + Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
