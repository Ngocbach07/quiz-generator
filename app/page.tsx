'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Sparkles, Wand2, AlertCircle, FileText, Zap, ShieldCheck, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentUploader from '@/components/quiz/DocumentUploader';
import SettingsPanel from '@/components/quiz/SettingsPanel';
import QuizView from '@/components/quiz/QuizView';
import type { Quiz, SourceDocument } from '@/types';

export default function Home() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<SourceDocument[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Settings
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState<('single' | 'multi')[]>(['single', 'multi']);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');

  // Concatenate all documents into a single text source, with separators.
  const combinedText = documents
    .map((d) => `=== Document: ${d.name} ===\n${d.text}`)
    .join('\n\n');

  const handleGenerate = async () => {
    if (!combinedText.trim()) {
      setError(t('language') === 'Ngôn Ngữ' ? 'Vui lòng thêm ít nhất một tài liệu.' : 'Please add at least one document.');
      return;
    }
    if (!apiKey.trim()) {
      setError(t('language') === 'Ngôn Ngữ' ? 'Vui lòng cung cấp API key.' : 'Please provide an API key.');
      return;
    }
    if (questionTypes.length === 0) {
      setError(t('language') === 'Ngôn Ngữ' ? 'Vui lòng chọn ít nhất một loại câu hỏi.' : 'Please select at least one question type.');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: combinedText,
          settings: { apiKey, baseUrl, model, temperature, maxTokens },
          questionCount,
          questionTypes,
          difficulty,
          language: t('language') === 'Ngôn Ngữ' ? 'vi' : 'en',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to generate quiz.');
      } else {
        setQuiz({
          ...data.quiz,
          model,
          sourceText: combinedText.slice(0, 4000),
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (quiz) {
    return (
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <QuizView quiz={quiz} onRestart={() => setQuiz(null)} />
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="mb-10 text-center animate-fade-in">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          {t('language') === 'Ngôn Ngữ' ? 'Tạo quiz AI từ tài liệu' : 'AI-powered quiz generation'}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          <span className="brand-text">{t('generateQuiz')}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t('language') === 'Ngôn Ngữ'
            ? 'Thêm nhiều tài liệu, quét model từ API của bạn và tạo quiz bằng AI.'
            : 'Add multiple documents, scan models from your API, and generate AI quizzes.'}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
          <Pill icon={<FileText className="size-3.5" />}>PDF · DOCX · TXT · URL</Pill>
          <Pill icon={<Layers className="size-3.5" />}>{t('language') === 'Ngôn Ngữ' ? 'Nhiều tài liệu' : 'Multi-document'}</Pill>
          <Pill icon={<Zap className="size-3.5" />}>Scan models</Pill>
          <Pill icon={<ShieldCheck className="size-3.5" />}>{t('language') === 'Ngôn Ngữ' ? 'Riêng tư' : 'Private'}</Pill>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: uploader + generate */}
        <div className="lg:col-span-2 space-y-5">
          <DocumentUploader documents={documents} setDocuments={setDocuments} />

          {loading && (
            <div className="space-y-3 rounded-2xl border border-foreground/10 bg-card p-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                {t('generating')}
              </div>
              <div className="space-y-2">
                {[80, 95, 60, 88].map((w, i) => (
                  <div key={i} className="h-3 rounded-md shimmer" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={loading || documents.length === 0}
              className="h-12 px-6 brand-gradient text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              <span className="font-semibold">
                {loading ? t('generating') : t('generate')}
              </span>
            </Button>
          </div>
        </div>

        {/* Right: settings */}
        <div className="space-y-4">
          <SettingsPanel
            apiKey={apiKey} setApiKey={setApiKey}
            baseUrl={baseUrl} setBaseUrl={setBaseUrl}
            model={model} setModel={setModel}
            temperature={temperature} setTemperature={setTemperature}
            maxTokens={maxTokens} setMaxTokens={setMaxTokens}
            questionCount={questionCount} setQuestionCount={setQuestionCount}
            questionTypes={questionTypes} setQuestionTypes={setQuestionTypes}
            difficulty={difficulty} setDifficulty={setDifficulty}
          />
        </div>
      </div>
    </main>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-muted/30 px-3 py-1 text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </span>
  );
}
