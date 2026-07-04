'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, ChevronLeft, ChevronRight, RotateCcw, Sparkles, Trophy, BookOpen, Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Quiz } from '@/types';

export interface QuizViewProps {
  quiz: Quiz;
  onRestart?: () => void;
}

enum Mode { REVIEW, QUIZ }

export default function QuizView({ quiz, onRestart }: QuizViewProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>(Mode.REVIEW);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const total = quiz.questions.length;
  const progress = ((currentIndex + (submitted ? 1 : 0)) / total) * 100;

  const toggleOption = (id: string) => {
    if (submitted) return;
    const next = new Set(selectedIds);
    if (question.type === 'single') {
      next.clear();
      next.add(id);
    } else {
      if (next.has(id)) next.delete(id);
      else next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSubmit = () => {
    if (selectedIds.size === 0) return;
    const correctSet = new Set(question.correctAnswerIds);
    const isCorrect =
      selectedIds.size === correctSet.size &&
      [...selectedIds].every((id) => correctSet.has(id));
    if (isCorrect) setScore((s) => s + 1);
    setSubmitted(true);
    setHistory((h) => [...h, isCorrect ? 1 : 0]);
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      resetQuestion();
    } else {
      setShowResult(true);
    }
  };

  const resetQuestion = () => {
    setSelectedIds(new Set());
    setSubmitted(false);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    resetQuestion();
    setScore(0);
    setHistory([]);
    setShowResult(false);
    setMode(Mode.QUIZ);
  };

  // Intro / review screen
  if (mode === Mode.REVIEW && showResult === false && currentIndex === 0 && score === 0 && history.length === 0) {
    return (
      <div className="mx-auto max-w-3xl animate-fade-in">
        <Card className="card-hover glass glass-border overflow-hidden rounded-3xl">
          <div className="relative brand-gradient p-8 text-center text-white">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 20% rgba(255,255,255,.3), transparent 50%), radial-gradient(circle at 80% 80% rgba(255,255,255,.2), transparent 50%)' }} />
            <div className="relative">
              <span className="inline-flex items-center justify-center rounded-2xl bg-white/15 p-3 backdrop-blur-sm mb-4">
                <Sparkles className="size-7" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{quiz.title}</h2>
              {quiz.description && (
                <p className="mt-2 text-sm text-white/80 max-w-xl mx-auto">{quiz.description}</p>
              )}
            </div>
          </div>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
            <Stat icon={<BookOpen className="size-4" />} label="Questions" value={total} />
            <Stat icon={<Target className="size-4" />} label="Questions types" value={Array.from(new Set(quiz.questions.map((q) => q.type))).join(' · ')} />
            <Stat icon={<Sparkles className="size-4" />} label="Model" value={quiz.model || 'custom'} />
          </CardContent>
          <div className="flex flex-col sm:flex-row justify-center gap-2 p-6 pt-0">
            <Button onClick={() => setMode(Mode.QUIZ)} size="lg" className="h-11 brand-gradient text-white shadow-lg shadow-primary/25">
              <Sparkles className="size-4" />
              Take Quiz
            </Button>
            <Button variant="outline" size="lg" onClick={onRestart} className="h-11">
              <Plus className="size-4" />
              Generate New
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
    const gradeColor = pct >= 80 ? 'text-emerald-500' : pct >= 60 ? 'text-amber-500' : 'text-rose-500';
    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
        <Card className="card-hover glass glass-border overflow-hidden rounded-3xl text-center">
          <CardHeader className="relative p-8 brand-gradient text-white">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 30% rgba(255,255,255,.35), transparent 60%)' }} />
            <div className="relative">
              <span className="inline-grid size-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm mx-auto mb-3">
                <Trophy className="size-8" />
              </span>
              <CardTitle className="text-2xl font-bold text-white">Quiz Complete!</CardTitle>
              <CardDescription className="text-white/80">You finished the quiz</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="relative grid place-items-center">
              <svg className="size-36 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="url(#grad)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 327} 327`}
                  style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--brand-gradient-from)" />
                    <stop offset="50%" stopColor="var(--brand-gradient-via)" />
                    <stop offset="100%" stopColor="var(--brand-gradient-to)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold tabular-nums ${gradeColor}`}>{pct}%</div>
                  <div className="text-xs text-muted-foreground">Grade {grade}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatBlock label="Correct" value={score} className="text-emerald-500" />
              <StatBlock label="Total" value={total} className="text-foreground" />
            </div>

            {/* Per-question history */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">Question breakdown</div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {history.map((h, i) => (
                  <span
                    key={i}
                    className={`grid size-7 place-items-center rounded-md text-xs font-semibold ${
                      h ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}
                    title={`Q${i + 1}: ${h ? 'correct' : 'incorrect'}`}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
              <Button onClick={restartQuiz} size="lg" className="h-11 brand-gradient text-white">
                <RotateCcw className="size-4" /> Retry
              </Button>
              <Button variant="outline" size="lg" onClick={onRestart} className="h-11">
                <Plus className="size-4" /> Generate New
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      {/* Top bar: progress + counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">
            {t('language') === 'Ngôn Ngữ' ? 'Câu' : 'Question'} {currentIndex + 1} / {total}
          </span>
          <Badge variant={question.type === 'single' ? 'secondary' : 'default'} className="rounded-full">
            {question.type === 'single' ? t('singleChoice') : t('multiChoice')}
          </Badge>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
          <div
            className="absolute inset-y-0 left-0 brand-gradient rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <Card className="card-hover glass glass-border overflow-hidden rounded-2xl animate-slide-up" key={currentIndex}>
        <CardContent className="p-6 space-y-5">
          <h3 className="text-base font-semibold leading-relaxed sm:text-lg">{question.question}</h3>
          <div className="space-y-2.5">
            {question.options.map((opt, i) => {
              const isSelected = selectedIds.has(opt.id);
              const isCorrect = question.correctAnswerIds.includes(opt.id);
              const letter = String.fromCharCode(65 + i);
              let state = 'idle';
              if (submitted) {
                if (isCorrect) state = 'correct';
                else if (isSelected) state = 'wrong';
              } else if (isSelected) state = 'selected';

              return (
                <button
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  disabled={submitted}
                  data-state={state}
                  className={`group/option w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3
                    data-[state=idle]:border-foreground/10 data-[state=idle]:bg-muted/20 data-[state=idle]:hover:border-primary/40 data-[state=idle]:hover:bg-primary/5 data-[state=idle]:cursor-pointer
                    data-[state=selected]:border-primary data-[state=selected]:bg-primary/10 data-[state=selected]:cursor-pointer
                    data-[state=correct]:border-emerald-500/50 data-[state=correct]:bg-emerald-500/12
                    data-[state=wrong]:border-rose-500/50 data-[state=wrong]:bg-rose-500/12
                  `}
                >
                  <span className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold transition-colors
                    data-[state=idle]:bg-muted data-[state=idle]:text-muted-foreground group-hover/option/data-[state=idle]:bg-primary/15 group-hover/option/data-[state=idle]:text-primary
                    data-[state=selected]:bg-primary data-[state=selected]:text-primary-foreground
                    data-[state=correct]:bg-emerald-500 data-[state=correct]:text-white
                    data-[state=wrong]:bg-rose-500 data-[state=wrong]:text-white
                  `} data-state={state}>
                    {submitted && isCorrect ? <Check className="size-4" /> : submitted && isSelected && !isCorrect ? <X className="size-4" /> : letter}
                  </span>
                  <span className="text-sm leading-relaxed pt-0.5 flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {submitted && question.explanation && (
            <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 animate-fade-in">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                <Sparkles className="size-3.5" />
                {t('explanation')}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nav buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => { setCurrentIndex((i) => Math.max(0, i - 1)); resetQuestion(); }}
          className="h-10"
        >
          <ChevronLeft className="size-4" />
          {t('previousQuestion')}
        </Button>
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={selectedIds.size === 0} className="h-10 brand-gradient text-white">
            {t('submitAnswer')}
          </Button>
        ) : (
          <Button onClick={handleNext} className="h-10 brand-gradient text-white">
            {isLast ? (
              <>
                {t('finishQuiz')} <Trophy className="size-4" />
              </>
            ) : (
              <>
                {t('nextQuestion')} <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-muted/20 p-3 text-center">
      <div className="mx-auto mb-1 grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold capitalize">{value}</div>
    </div>
  );
}

function StatBlock({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-muted/20 p-4 text-center">
      <div className={`text-3xl font-bold tabular-nums ${className || ''}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
