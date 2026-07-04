'use client';

import { useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Link as LinkIcon, FileText, FileUp, X, Loader2, Check, AlertCircle, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import type { SourceDocument } from '@/types';

interface DocumentUploaderProps {
  documents: SourceDocument[];
  setDocuments: (docs: SourceDocument[]) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(String(e.target?.result || ''));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentUploader({ documents, setDocuments }: DocumentUploaderProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualText, setManualText] = useState('');
  const [manualName, setManualName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addDoc = (doc: SourceDocument) => {
    // dedupe by name+size
    if (documents.some((d) => d.name === doc.name && d.size === doc.size)) return;
    setDocuments([...documents, doc]);
  };

  const removeDoc = (id: string) => setDocuments(documents.filter((d) => d.id !== id));

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setLoading(true);
      setError('');
      try {
        const files = Array.from(fileList);
        for (const file of files) {
          const extracted = await extractTextFromFile(file);
          addDoc({
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            type: file.type || 'text',
            text: extracted,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read file(s)');
      } finally {
        setLoading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documents, setDocuments]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) {
        await processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await processFiles(e.target.files);
    }
  };

  const handleFetchUrl = async () => {
    if (!url.trim()) return;
    setUrlLoading(true);
    setError('');
    try {
      const res = await fetch(url, { mode: 'cors' });
      const html = await res.text();
      const stripped = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const text = stripped.slice(0, 32_000);
      let name = url;
      try {
        name = new URL(url).hostname + new URL(url).pathname.replace(/\//g, '_').slice(0, 30) || url;
      } catch {}
      addDoc({
        id: crypto.randomUUID(),
        name: name || 'url-content',
        size: text.length,
        type: 'text',
        text,
      });
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URL');
    } finally {
      setUrlLoading(false);
    }
  };

  const addManualText = () => {
    if (!manualText.trim()) return;
    addDoc({
      id: crypto.randomUUID(),
      name: manualName.trim() || `text-${documents.length + 1}.txt`,
      size: manualText.length,
      type: 'text',
      text: manualText,
    });
    setManualText('');
    setManualName('');
  };

  const totalWords = documents.reduce(
    (acc, d) => acc + d.text.split(/\s+/).filter(Boolean).length,
    0
  );
  const totalChars = documents.reduce((acc, d) => acc + d.text.length, 0);

  return (
    <div className="space-y-3">
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-3 h-10 p-1 rounded-xl">
          <TabsTrigger value="upload" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            <Upload className="size-3.5" />
            <span className="hidden sm:inline">{t('uploadDocument')}</span>
            <span className="sm:hidden">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            <LinkIcon className="size-3.5" />
            <span>URL</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            <FileText className="size-3.5" />
            <span>{t('language') === 'Ngôn Ngữ' ? 'Văn bản' : 'Text'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/8 scale-[1.01] shadow-lg shadow-primary/10'
                : 'border-foreground/15 hover:border-primary/40 hover:bg-muted/30'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.docx,.txt,.pptx,.md,.csv"
              multiple
              onChange={handleFileInput}
            />

            {loading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="size-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Reading files...</p>
              </div>
            ) : (
              <>
                <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-muted/40 text-primary transition-transform duration-300 group-hover:scale-110">
                  <FileUp className="size-7" />
                </span>
                <p className="mb-1.5 text-sm font-semibold">{t('dragDrop')}</p>
                <p className="text-xs text-muted-foreground mb-4">{t('supportedFormats')} · drop multiple files</p>
                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" render={<span />} className="cursor-pointer">
                    <Upload className="size-3.5" />
                    Browse files
                  </Button>
                </label>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-card p-4">
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('urlPlaceholder')}
                className="h-10 flex-1 text-sm"
              />
              <Button onClick={handleFetchUrl} disabled={urlLoading || !url.trim()} className="h-10 brand-gradient text-white">
                {urlLoading ? <Loader2 className="size-4 animate-spin" /> : <LinkIcon className="size-4" />}
                <span className="hidden sm:inline">{t('fetchContent')}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste a public URL — page text gets extracted and added as a source document.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="text" className="mt-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-card p-4">
            <Input
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder={t('language') === 'Ngôn Ngữ' ? 'Tên tài liệu (tùy chọn)' : 'Document name (optional)'}
              className="h-9 text-sm font-medium"
            />
            <Textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={t('language') === 'Ngôn Ngữ' ? 'Dán văn bản của bạn vào đây...' : 'Paste your text here...'}
              className="min-h-[180px] rounded-xl text-sm leading-relaxed"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {manualText.split(/\s+/).filter(Boolean).length} words · {manualText.length} chars
              </span>
              <Button variant="outline" size="sm" onClick={addManualText} disabled={!manualText.trim()}>
                <Plus className="size-3.5" />
                {t('language') === 'Ngôn Ngữ' ? 'Thêm tài liệu' : 'Add document'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive animate-fade-in">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Source documents list */}
      {documents.length > 0 && (
        <div className="rounded-2xl border border-foreground/10 bg-card p-3 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Layers className="size-3.5" />
              {t('language') === 'Ngôn Ngữ' ? `Tài liệu nguồn (${documents.length})` : `Source documents (${documents.length})`}
            </div>
            <button
              onClick={() => setDocuments([])}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          </div>
          <ul className="space-y-1.5">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-muted/30 p-2.5 animate-slide-up"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg brand-gradient text-white">
                  <Check className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(doc.size)} · {doc.text.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
                <Button variant="ghost" size="icon-xs" onClick={() => removeDoc(doc.id)} aria-label="Remove">
                  <X className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-1 pt-1 text-xs text-muted-foreground border-t border-foreground/10">
            <span>Total: {documents.length} docs · {totalWords.toLocaleString()} words · {totalChars.toLocaleString()} chars</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}
