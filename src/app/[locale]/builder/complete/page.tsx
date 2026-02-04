"use client";

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';

type BuilderSummary = {
  name: string;
  layers: { type: string; label: string }[];
  createdAt: string;
};

const SUMMARY_KEY = 'topbun-builder-summary';

export default function BuilderCompletePage() {
  const t = useTranslations('builder');
  const router = useRouter();
  const [summary, setSummary] = useState<BuilderSummary | null>(null);
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SUMMARY_KEY);
    if (!raw) {
      router.replace('/builder');
      return;
    }
    setSummary(JSON.parse(raw) as BuilderSummary);
  }, [router]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const shareText = useMemo(() => {
    if (!summary) return '';
    return `${summary.name}\n${summary.layers.map((layer) => layer.label).join(' + ')}`;
  }, [summary]);

  const layerConfig = useMemo(
    () =>
      new Map<string, { className: string; color: string; height: number }>([
        ['bun-top', { className: 'h-10 rounded-full', color: '#d07a3a', height: 40 }],
        ['bun-bottom', { className: 'h-8 rounded-full', color: '#b5652a', height: 32 }],
        ['lettuce', { className: 'h-3 rounded-full', color: '#43a047', height: 12 }],
        ['tomato', { className: 'h-3 rounded-full', color: '#e53935', height: 12 }],
        ['onion', { className: 'h-2 rounded-full', color: '#8e24aa', height: 8 }],
        ['pickle', { className: 'h-2 rounded-full', color: '#7cb342', height: 8 }],
        ['cheese', { className: 'h-2 rounded-full', color: '#f6c343', height: 8 }],
        ['smashed-patty', { className: 'h-4 rounded-xl', color: '#6d4c41', height: 16 }],
        ['grilled-patty', { className: 'h-5 rounded-xl', color: '#5d4037', height: 20 }],
        ['chicken-patty', { className: 'h-4 rounded-xl', color: '#f4a261', height: 16 }],
        ['veggie-patty', { className: 'h-4 rounded-xl', color: '#2e7d32', height: 16 }],
        ['bacon', { className: 'h-2 rounded-full', color: '#c62828', height: 8 }],
        ['egg', { className: 'h-3 rounded-full', color: '#f4d06f', height: 12 }],
        ['ketchup', { className: 'h-1.5 rounded-full', color: '#c62828', height: 6 }],
        ['mayo', { className: 'h-1.5 rounded-full', color: '#f5f5f5', height: 6 }],
        ['mustard', { className: 'h-1.5 rounded-full', color: '#f9a825', height: 6 }],
        ['bbq', { className: 'h-1.5 rounded-full', color: '#5d4037', height: 6 }],
        ['spicy-mayo', { className: 'h-1.5 rounded-full', color: '#ef6c00', height: 6 }],
        ['garlic-sauce', { className: 'h-1.5 rounded-full', color: '#d7ccc8', height: 6 }],
      ]),
    [],
  );

  const layers = summary
    ? summary.layers.map((layer) => ({
        ...layer,
        config: layerConfig.get(layer.type) ?? {
          className: 'h-3 rounded-full',
          color: '#8d6e63',
          height: 12,
        },
      }))
    : [];

  const svgMarkup = useMemo(() => {
    if (!summary) return '';
    const width = 280;
    const padding = 12;
    const totalHeight = layers.reduce((sum, layer) => sum + layer.config.height + 6, 40);
    let y = padding;
    const rects = layers.map((layer) => {
      const h = layer.config.height;
      const rect = `<rect x="${padding}" y="${y}" rx="14" ry="14" width="${width - padding * 2}" height="${h}" fill="${layer.config.color}" />`;
      y += h + 6;
      return rect;
    });
    return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}"><rect width="100%" height="100%" fill="#FFF7E6" /><text x="${width / 2}" y="24" text-anchor="middle" font-size="16" font-family="Arial" fill="#3A2D1F">${summary.name}</text>${rects.join('\n')}</svg>`;
  }, [layers, summary]);

  const fireToast = (message: string) => {
    setToastMessage(message);
    window.dispatchEvent(new CustomEvent('topbun:toast', { detail: { message } }));
  };

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      fireToast(t('copySuccess'));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  async function handleOpenGemini() {
    if (!summary) return;

    const prompt = `Create a hyper-realistic, mouth-watering studio photograph of a custom gourmet burger called "${summary.name}".

The burger is built with these layers from top to bottom:
${summary.layers
      .map((layer, index) => `${index + 1}. ${layer.label}`)
      .join('\n')}

Style requirements:
- Professional food photography with warm, golden lighting
- Shallow depth of field with bokeh background
- Each ingredient should be clearly visible and identifiable
- The burger name "${summary.name}" should appear as elegant text overlay in the corner
- Steam rising from the patty
- Sesame seeds on the bun if applicable
- No logos, no watermarks
- 4K quality, appetizing presentation`;

    try {
      await navigator.clipboard.writeText(prompt);
      setPromptCopied(true);
      fireToast(t('geminiGuide'));
      setTimeout(() => setPromptCopied(false), 3000);
      window.open('https://gemini.google.com/', '_blank');
    } catch {
      setPromptCopied(false);
    }
  }

  async function handleShare() {
    if (!summary) return;
    const url = window.location.href;
    const payload = { title: summary.name, text: shareText, url };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        fireToast(t('shareSuccess'));
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      fireToast(t('copySuccess'));
    } catch {
      return;
    }
  }

  if (!summary) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl bg-surface p-8 text-center">
        <div className="mx-auto flex max-w-xs flex-col items-stretch gap-2 rounded-3xl bg-surface-light p-6 shadow-lg">
          {layers.map((layer, idx) => (
            <div
              key={`${layer.type}-${idx}`}
              className={`w-full ${layer.config.className} ${layer.type.includes('bun') ? 'shadow-md' : 'shadow-sm'}`}
              style={{ backgroundColor: layer.config.color }}
              aria-label={layer.label}
            />
          ))}
        </div>
        {toastMessage && (
          <div className="mt-4 rounded-2xl border border-accent/40 bg-accent/15 px-4 py-3 text-sm font-semibold text-accent">
            {toastMessage}
          </div>
        )}
        <h1 className="mt-6 text-3xl font-bold text-text">{t('completeTitle')}</h1>
        <p className="mt-2 text-text-muted">{t('completeSubtitle')}</p>

        <div className="mt-6 rounded-2xl bg-surface-light p-6 text-left">
          <p className="text-sm text-text-muted">{t('summary')}</p>
          <h2 className="mt-2 text-xl font-bold text-text">{summary.name}</h2>
          <ul className="mt-3 space-y-1 text-sm text-text-muted">
            {summary.layers.map((layer, idx) => (
              <li key={`${layer.type}-${idx}`}>• {layer.label}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            aria-label="Copy burger recipe to clipboard"
          >
            {copied ? t('copySuccess') : t('copyShare')}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-text hover:bg-surface-light"
            aria-label="Share burger summary"
          >
            {t('share')}
          </button>
          <button
            type="button"
            onClick={handleOpenGemini}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
            aria-label="Open Gemini AI to generate burger image"
          >
            {promptCopied ? t('promptCopied') : t('generateImage')}
          </button>
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'topbun-burger.svg';
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-text hover:bg-surface-light"
            aria-label="Download burger visualization as SVG"
          >
            {t('downloadImage')}
          </button>
          <Link
            href="/builder"
            className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-text hover:bg-surface-light"
          >
            {t('buildAgain')}
          </Link>
        </div>
      </div>
    </div>
  );
}
