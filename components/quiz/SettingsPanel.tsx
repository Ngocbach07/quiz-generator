'use client';

import { useTranslation } from 'react-i18next';
import { Key, Server, Cpu, Thermometer, Hash, ListChecks, Gauge, Eye, EyeOff, ScanLine, Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export interface SettingsPanelProps {
  apiKey: string;
  setApiKey: (v: string) => void;
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  temperature: number;
  setTemperature: (v: number) => void;
  maxTokens: number;
  setMaxTokens: (v: number) => void;
  questionCount: number;
  setQuestionCount: (v: number) => void;
  questionTypes: ('single' | 'multi')[];
  setQuestionTypes: (v: ('single' | 'multi')[]) => void;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  setDifficulty: (v: 'easy' | 'medium' | 'hard' | 'mixed') => void;
}

const MODEL_PRESETS = [
  { label: 'GPT-4o', model: 'gpt-4o', baseUrl: 'https://api.openai.com/v1' },
  { label: 'GPT-4o mini', model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
  { label: 'Claude (Sonnet)', model: 'claude-3-5-sonnet-latest', baseUrl: 'https://api.anthropic.com/v1' },
  { label: 'Gemini 1.5 Pro', model: 'gemini-1.5-pro', baseUrl: 'https://generativelanguage.googleapis.com/v1beta' },
  { label: 'DeepSeek', model: 'deepseek-chat', baseUrl: 'https://api.deepseek.com' },
];

export default function SettingsPanel(props: SettingsPanelProps) {
  const { t } = useTranslation();
  const {
    apiKey, setApiKey, baseUrl, setBaseUrl, model, setModel,
    temperature, setTemperature, maxTokens, setMaxTokens,
    questionCount, setQuestionCount, questionTypes, setQuestionTypes,
    difficulty, setDifficulty
  } = props;

  const [showKey, setShowKey] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedModels, setScannedModels] = useState<string[]>([]);
  const [scanError, setScanError] = useState('');

  const scanModels = async () => {
    if (!baseUrl.trim() || !apiKey.trim()) return;
    setScanning(true);
    setScanError('');
    setScannedModels([]);
    try {
      const res = await fetch('/api/scan-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl, apiKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setScanError(data.error || 'Scan failed');
      } else if (data.models?.length) {
        setScannedModels(data.models);
        if (!data.models.includes(model)) setModel(data.models[0]);
      } else {
        setScanError('No models found.');
      }
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setScanning(false);
    }
  };

  const toggleType = (type: 'single' | 'multi') => {
    if (questionTypes.includes(type)) {
      setQuestionTypes(questionTypes.filter((x) => x !== type));
    } else {
      setQuestionTypes([...questionTypes, type]);
    }
  };

  const applyPreset = (p: typeof MODEL_PRESETS[number]) => {
    setModel(p.model);
    setBaseUrl(p.baseUrl);
  };

  const difficultyColors: Record<string, string> = {
    easy: 'data-[active=true]:bg-emerald-500/15 data-[active=true]:text-emerald-600 data-[active=true]:border-emerald-500/40 dark:data-[active=true]:text-emerald-400',
    medium: 'data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-600 data-[active=true]:border-amber-500/40 dark:data-[active=true]:text-amber-400',
    hard: 'data-[active=true]:bg-rose-500/15 data-[active=true]:text-rose-600 data-[active=true]:border-rose-500/40 dark:data-[active=true]:text-rose-400',
    mixed: 'data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:border-primary/40',
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="card-hover glass glass-border overflow-hidden rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="grid size-7 place-items-center rounded-lg brand-gradient text-white">
              <Key className="size-3.5" />
            </span>
            {t('apiSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Key */}
          <div className="space-y-1.5">
            <Label htmlFor="apiKey" className="text-xs font-medium text-muted-foreground">{t('apiKey')}</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="h-9 pr-9 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle key visibility"
              >
                {showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>
          </div>

          {/* Base URL */}
          <div className="space-y-1.5">
            <Label htmlFor="baseUrl" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Server className="size-3.5" />
              {t('baseUrl')}
            </Label>
            <Input id="baseUrl" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.openai.com/v1" className="h-9 font-mono text-xs" />
          </div>

          {/* Model with presets + Scan button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="model" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Cpu className="size-3.5" />
                {t('model')}
              </Label>
              <button
                type="button"
                onClick={scanModels}
                disabled={scanning || !baseUrl.trim() || !apiKey.trim()}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary transition-all hover:bg-primary/15 hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Fetch available models from your endpoint"
              >
                {scanning ? <Loader2 className="size-3 animate-spin" /> : <ScanLine className="size-3" />}
                <span>{scanning ? 'Scanning...' : 'Scan models'}</span>
              </button>
            </div>
            <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o" className="h-9 font-mono text-xs" />
            {scannedModels.length > 0 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-2 space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <CheckCircle2 className="size-3" />
                    {scannedModels.length} models found
                  </span>
                  <button onClick={() => setScannedModels([])} className="hover:text-foreground transition-colors">
                    Clear
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-0.5 pretty-scroll">
                  {scannedModels.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModel(m)}
                      className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left font-mono text-[11px] transition-colors ${
                        model === m
                          ? 'bg-primary/15 text-primary'
                          : 'hover:bg-muted/60 text-foreground/80'
                      }`}
                    >
                      <span className="truncate">{m}</span>
                      {model === m && <CheckCircle2 className="size-3 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {scanError && (
              <div className="flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1.5 text-[11px] text-destructive animate-fade-in">
                <AlertCircle className="size-3 shrink-0" />
                <span className="truncate">{scanError}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {MODEL_PRESETS.map((p) => {
                const active = model === p.model && baseUrl === p.baseUrl;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-all ${
                      active
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-foreground/10 bg-muted/30 text-muted-foreground hover:border-foreground/20 hover:text-foreground'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Thermometer className="size-3.5" />
                {t('temperature')}
              </Label>
              <span className="rounded-md bg-muted/50 px-2 py-0.5 font-mono text-xs tabular-nums">{temperature.toFixed(1)}</span>
            </div>
            <Slider value={[temperature]} onValueChange={(v) => setTemperature((v as number[])[0])} min={0} max={2} step={0.1} className="py-1" />
            <p className="text-[11px] text-muted-foreground">Lower = focused · Higher = creative</p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-1.5">
            <Label htmlFor="maxTokens" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Hash className="size-3.5" />
              {t('maxTokens')}
            </Label>
            <Input id="maxTokens" type="number" value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} className="h-9 font-mono text-xs" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover glass glass-border overflow-hidden rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="grid size-7 place-items-center rounded-lg brand-gradient text-white">
              <ListChecks className="size-3.5" />
            </span>
            {t('quizOptions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Question count */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Gauge className="size-3.5" />
                {t('numQuestions')}
              </Label>
              <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs tabular-nums text-primary">{questionCount}</span>
            </div>
            <Slider value={[questionCount]} onValueChange={(v) => setQuestionCount((v as number[])[0])} min={1} max={50} step={1} className="py-1" />
          </div>

          {/* Question type */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{t('questionType')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['single', 'multi'] as const).map((type) => {
                const active = questionTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    data-active={active}
                    onClick={() => toggleType(type)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all data-[active=true]:border-primary/40 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=false]:border-foreground/10 data-[active=false]:bg-muted/30 data-[active=false]:text-muted-foreground data-[active=false]:hover:border-foreground/20`}
                  >
                    <span className={`grid size-4 place-items-center rounded-full border ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20'}`}>
                      {active && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                    </span>
                    {type === 'single' ? t('singleChoice') : t('multiChoice')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{t('difficulty')}</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['easy', 'medium', 'hard', 'mixed'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  data-active={difficulty === d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-all ${difficultyColors[d]} border-foreground/10 bg-muted/30 text-muted-foreground hover:border-foreground/20`}
                >
                  {t(d)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
